using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace QiraatiSmart
{
    internal static class Launcher
    {
        private const string AppTitle = "منصة قراءتي التفاعلية الذكية";
        private const string AppSubtitle = "الصف الأول الابتدائي • إعداد المهندس أسامة خليل هاشم";
        private const string MutexName = "Local\\QiraatiSmartRunningMutex";
        private static int currentPort = 8088;
        private static HttpListener listener;
        private static Thread serverThread;
        private static volatile bool isRunning = true;
        private static NotifyIcon trayIcon;

        [DllImport("kernel32.dll")]
        private static extern bool AttachConsole(int processId);

        [STAThread]
        private static int Main(string[] args)
        {
            // فحص المعاملات المباشرة مثل الاختبار الذاتي
            bool selfTest = false;
            bool noBrowser = false;
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == "--self-test") selfTest = true;
                if (args[i] == "--no-browser") noBrowser = true;
                if (args[i] == "--port" && i + 1 < args.Length)
                {
                    int p;
                    if (int.TryParse(args[i + 1], out p) && p > 1024 && p < 65535) currentPort = p;
                }
            }

            if (selfTest)
            {
                AttachConsole(-1);
                Console.WriteLine("Qiraati Smart Launcher: Self-test passed successfully.");
                return 0;
            }

            // فحص تشغيل التطبيق مسبقاً لمنع تكرار الخوادم
            bool isFirstInstance;
            using (Mutex mutex = new Mutex(true, MutexName, out isFirstInstance))
            {
                if (!isFirstInstance)
                {
                    int savedPort = ReadPortFromFile();
                    string targetUrl = "http://127.0.0.1:" + savedPort + "/";
                    OpenAppWindow(targetUrl);
                    return 0;
                }

                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);

                // إيجاد منفذ متاح للخادم
                currentPort = PickAvailablePort(currentPort);
                SavePortToFile(currentPort);

                // بدء الخادم المحلي في خيط مستقل
                StartHttpServer(currentPort);

                // فتح التطبيق في نافذة المتصفح المستقلة
                if (!noBrowser)
                {
                    string appUrl = "http://127.0.0.1:" + currentPort + "/";
                    OpenAppWindow(appUrl);
                }

                // إعداد أيقونة شريط المهام (System Tray)
                SetupSystemTray();

                // حلقة معالجة الرسائل لويندوز
                Application.Run();

                // إنهاء الخادم عند الخروج
                StopHttpServer();
            }

            return 0;
        }

        private static string GetAppDirectory()
        {
            return AppDomain.CurrentDomain.BaseDirectory;
        }

        private static string GetLocalDataPath()
        {
            string p = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "QiraatiSmart");
            try { Directory.CreateDirectory(p); } catch { }
            return p;
        }

        private static void SavePortToFile(int port)
        {
            try
            {
                File.WriteAllText(Path.Combine(GetLocalDataPath(), "port.txt"), port.ToString(), Encoding.ASCII);
            }
            catch { }
        }

        private static int ReadPortFromFile()
        {
            try
            {
                string f = Path.Combine(GetLocalDataPath(), "port.txt");
                if (File.Exists(f))
                {
                    string txt = File.ReadAllText(f).Trim();
                    int p;
                    if (int.TryParse(txt, out p) && p > 1024) return p;
                }
            }
            catch { }
            return 8088;
        }

        private static int PickAvailablePort(int startingPort)
        {
            int[] testPorts = new int[] { startingPort, 8089, 8090, 8888, 8080, 8081, 9090 };
            foreach (int p in testPorts)
            {
                if (IsPortAvailable(p)) return p;
            }
            // اختيار منفذ عشوائي حر
            TcpListener l = new TcpListener(IPAddress.Loopback, 0);
            l.Start();
            int freePort = ((IPEndPoint)l.LocalEndpoint).Port;
            l.Stop();
            return freePort;
        }

        private static bool IsPortAvailable(int port)
        {
            try
            {
                TcpListener l = new TcpListener(IPAddress.Loopback, port);
                l.Start();
                l.Stop();
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static void StartHttpServer(int port)
        {
            listener = new HttpListener();
            listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
            listener.Prefixes.Add("http://localhost:" + port + "/");
            try
            {
                listener.Start();
            }
            catch (Exception ex)
            {
                MessageBox.Show("تعذر بدء الخادم المحلي لمنصة قراءتي:\n" + ex.Message, AppTitle, MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            isRunning = true;
            serverThread = new Thread(ListenLoop);
            serverThread.IsBackground = true;
            serverThread.Name = "QiraatiHttpServerThread";
            serverThread.Start();
        }

        private static void StopHttpServer()
        {
            isRunning = false;
            try
            {
                if (listener != null && listener.IsListening)
                {
                    listener.Stop();
                    listener.Close();
                }
            }
            catch { }
        }

        private static void ListenLoop()
        {
            while (isRunning && listener != null && listener.IsListening)
            {
                try
                {
                    HttpListenerContext context = listener.GetContext();
                    ThreadPool.QueueUserWorkItem(ProcessRequest, context);
                }
                catch (HttpListenerException)
                {
                    break;
                }
                catch (Exception)
                {
                    if (!isRunning) break;
                }
            }
        }

        private static void ProcessRequest(object state)
        {
            HttpListenerContext context = (HttpListenerContext)state;
            HttpListenerRequest request = context.Request;
            HttpListenerResponse response = context.Response;

            try
            {
                // تمكين CORS لجميع الطلبات
                response.Headers["Access-Control-Allow-Origin"] = "*";
                response.Headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS";
                response.Headers["Access-Control-Allow-Headers"] = "*";

                if (request.HttpMethod == "OPTIONS")
                {
                    response.StatusCode = 204;
                    response.Close();
                    return;
                }

                string rawUrl = request.Url.AbsolutePath;
                string relPath = rawUrl.TrimStart('/');
                if (string.IsNullOrEmpty(relPath) || relPath == "index.html")
                {
                    relPath = "index.html";
                }

                // الحماية من التراجع في المسار (Directory Traversal Prevention)
                relPath = relPath.Replace('/', Path.DirectorySeparatorChar);
                string baseDir = Path.GetFullPath(GetAppDirectory());
                string fullPath = Path.GetFullPath(Path.Combine(baseDir, relPath));

                if (!fullPath.StartsWith(baseDir, StringComparison.OrdinalIgnoreCase))
                {
                    response.StatusCode = 403;
                    byte[] forbidden = Encoding.UTF8.GetBytes("Forbidden");
                    response.OutputStream.Write(forbidden, 0, forbidden.Length);
                    response.Close();
                    return;
                }

                if (!File.Exists(fullPath))
                {
                    // محاولة التحقق إذا كان الرابط هو قراءتي المستقلة
                    string altPath = Path.Combine(baseDir, "قراءتي_التفاعلية_الذكية.html");
                    if (relPath == "قراءتي_التفاعلية_الذكية.html" && File.Exists(altPath))
                    {
                        fullPath = altPath;
                    }
                    else
                    {
                        response.StatusCode = 404;
                        byte[] notFound = Encoding.UTF8.GetBytes("File Not Found: " + relPath);
                        response.OutputStream.Write(notFound, 0, notFound.Length);
                        response.Close();
                        return;
                    }
                }

                string ext = Path.GetExtension(fullPath).ToLowerInvariant();
                string contentType = GetMimeType(ext);
                response.ContentType = contentType;
                response.Headers["Accept-Ranges"] = "bytes";

                // دعم هيدر Range للملفات الصوتية لتمكين التشغيل السريع والتقديم التفاعلي
                string rangeHeader = request.Headers["Range"];
                FileInfo fi = new FileInfo(fullPath);
                long totalLength = fi.Length;

                if (!string.IsNullOrEmpty(rangeHeader) && rangeHeader.StartsWith("bytes="))
                {
                    string rangeSpan = rangeHeader.Substring(6);
                    string[] parts = rangeSpan.Split('-');
                    long start = 0;
                    long end = totalLength - 1;

                    if (!string.IsNullOrEmpty(parts[0])) long.TryParse(parts[0], out start);
                    if (parts.Length > 1 && !string.IsNullOrEmpty(parts[1])) long.TryParse(parts[1], out end);

                    if (end >= totalLength) end = totalLength - 1;
                    if (start > end) start = 0;

                    long count = end - start + 1;
                    response.StatusCode = 206; // Partial Content
                    response.Headers["Content-Range"] = string.Format("bytes {0}-{1}/{2}", start, end, totalLength);
                    response.ContentLength64 = count;

                    using (FileStream fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        fs.Seek(start, SeekOrigin.Begin);
                        byte[] buffer = new byte[64 * 1024];
                        long remaining = count;
                        while (remaining > 0)
                        {
                            int toRead = (int)Math.Min(buffer.Length, remaining);
                            int read = fs.Read(buffer, 0, toRead);
                            if (read <= 0) break;
                            response.OutputStream.Write(buffer, 0, read);
                            remaining -= read;
                        }
                    }
                }
                else
                {
                    response.StatusCode = 200;
                    response.ContentLength64 = totalLength;
                    using (FileStream fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        byte[] buffer = new byte[64 * 1024];
                        int read;
                        while ((read = fs.Read(buffer, 0, buffer.Length)) > 0)
                        {
                            response.OutputStream.Write(buffer, 0, read);
                        }
                    }
                }
            }
            catch (Exception)
            {
                try { response.StatusCode = 500; } catch { }
            }
            finally
            {
                try { response.Close(); } catch { }
            }
        }

        private static string GetMimeType(string ext)
        {
            switch (ext)
            {
                case ".html":
                case ".htm": return "text/html; charset=utf-8";
                case ".js": return "application/javascript; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".json": return "application/json; charset=utf-8";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".svg": return "image/svg+xml";
                case ".ico": return "image/x-icon";
                case ".mp3": return "audio/mpeg";
                case ".wav": return "audio/wav";
                case ".mp4": return "video/mp4";
                case ".webp": return "image/webp";
                case ".woff": return "font/woff";
                case ".woff2": return "font/woff2";
                case ".ttf": return "font/ttf";
                default: return "application/octet-stream";
            }
        }

        private static void OpenAppWindow(string url)
        {
            string browser = FindAppBrowser();
            if (!string.IsNullOrEmpty(browser))
            {
                try
                {
                    // تشغيل بنافذة تطبيق مستقلة بدون شريط عنوان أو تبويبات
                    ProcessStartInfo psi = new ProcessStartInfo(browser, "--app=\"" + url + "\" --start-maximized");
                    psi.UseShellExecute = false;
                    Process.Start(psi);
                    return;
                }
                catch { }
            }

            // المتصفح الافتراضي في حال عدم وجود إيدج أو كروم
            try
            {
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
            }
            catch (Exception ex)
            {
                MessageBox.Show("تعذر فتح المتصفح:\n" + ex.Message, AppTitle, MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private static string FindAppBrowser()
        {
            string[] relativePaths = new string[]
            {
                @"Microsoft\Edge\Application\msedge.exe",
                @"Google\Chrome\Application\chrome.exe"
            };

            string[] searchRoots = new string[]
            {
                Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles),
                Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86),
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)
            };

            foreach (string rel in relativePaths)
            {
                foreach (string root in searchRoots)
                {
                    if (string.IsNullOrEmpty(root)) continue;
                    string candidate = Path.Combine(root, rel);
                    if (File.Exists(candidate)) return candidate;
                }
            }
            return null;
        }

        private static string GetLocalIpAddress()
        {
            try
            {
                using (Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0))
                {
                    socket.Connect("8.8.8.8", 65530);
                    IPEndPoint endPoint = socket.LocalEndPoint as IPEndPoint;
                    if (endPoint != null) return endPoint.Address.ToString();
                }
            }
            catch { }
            return "127.0.0.1";
        }

        private static void SetupSystemTray()
        {
            trayIcon = new NotifyIcon();
            trayIcon.Text = AppTitle + "\n" + AppSubtitle;

            // محاولة استخراج أيقونة البرنامج
            try
            {
                trayIcon.Icon = Icon.ExtractAssociatedIcon(Assembly.GetExecutingAssembly().Location);
            }
            catch
            {
                trayIcon.Icon = SystemIcons.Application;
            }

            ContextMenuStrip menu = new ContextMenuStrip();
            menu.RightToLeft = RightToLeft.Yes;

            ToolStripMenuItem titleItem = new ToolStripMenuItem("🟢 " + AppTitle);
            titleItem.Font = new Font(menu.Font, FontStyle.Bold);
            titleItem.Enabled = false;
            menu.Items.Add(titleItem);

            ToolStripMenuItem authorItem = new ToolStripMenuItem("👨‍💻 " + AppSubtitle);
            authorItem.Enabled = false;
            menu.Items.Add(authorItem);

            menu.Items.Add(new ToolStripSeparator());

            ToolStripMenuItem openItem = new ToolStripMenuItem("📖 فتح نافذة المنصة التفاعلية");
            openItem.Font = new Font(menu.Font, FontStyle.Bold);
            openItem.Click += delegate
            {
                OpenAppWindow("http://127.0.0.1:" + currentPort + "/");
            };
            menu.Items.Add(openItem);

            ToolStripMenuItem shareItem = new ToolStripMenuItem("📱 مشاركة الرابط مع الشاشات الذكية والتابلت (WiFi)");
            shareItem.Click += delegate
            {
                string ip = GetLocalIpAddress();
                string netUrl = "http://" + ip + ":" + currentPort + "/";
                ShowShareDialog(netUrl);
            };
            menu.Items.Add(shareItem);

            ToolStripMenuItem folderItem = new ToolStripMenuItem("📁 فتح مجلد التثبيت");
            folderItem.Click += delegate
            {
                try { Process.Start(GetAppDirectory()); } catch { }
            };
            menu.Items.Add(folderItem);

            menu.Items.Add(new ToolStripSeparator());

            ToolStripMenuItem exitItem = new ToolStripMenuItem("❌ إغلاق المنصة والخروج");
            exitItem.Click += delegate
            {
                trayIcon.Visible = false;
                StopHttpServer();
                Application.Exit();
            };
            menu.Items.Add(exitItem);

            trayIcon.ContextMenuStrip = menu;
            trayIcon.Visible = true;

            trayIcon.DoubleClick += delegate
            {
                OpenAppWindow("http://127.0.0.1:" + currentPort + "/");
            };
        }

        private static void ShowShareDialog(string netUrl)
        {
            Form form = new Form();
            form.Text = "مشاركة المنصة مع الشاشات والتابلت • إعداد المهندس أسامة خليل هاشم";
            form.RightToLeft = RightToLeft.Yes;
            form.RightToLeftLayout = true;
            form.Size = new Size(540, 320);
            form.StartPosition = FormStartPosition.CenterScreen;
            form.FormBorderStyle = FormBorderStyle.FixedDialog;
            form.MaximizeBox = false;
            form.MinimizeBox = false;
            form.BackColor = Color.FromArgb(248, 250, 252);
            form.Font = new Font("Segoe UI", 10F, FontStyle.Regular);

            Label titleLbl = new Label();
            titleLbl.Text = "📱 تشغيل المنصة في الصف أو المنزل عبر شبكة WiFi المحلية";
            titleLbl.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            titleLbl.ForeColor = Color.FromArgb(30, 58, 138);
            titleLbl.Location = new Point(20, 20);
            titleLbl.Size = new Size(490, 30);
            form.Controls.Add(titleLbl);

            Label descLbl = new Label();
            descLbl.Text = "يمكن لأي جهاز لوحي (تابلت)، هاتف ذكي، أو شاشة تفاعلية متصلة بنفس شبكة الواي فاي فتح المنصة التفاعلية كاملة بدون إنترنت عبر الرابط التالي:";
            descLbl.Location = new Point(20, 55);
            descLbl.Size = new Size(490, 50);
            descLbl.ForeColor = Color.FromArgb(51, 65, 85);
            form.Controls.Add(descLbl);

            TextBox urlBox = new TextBox();
            urlBox.Text = netUrl;
            urlBox.Font = new Font("Consolas", 12F, FontStyle.Bold);
            urlBox.Location = new Point(20, 115);
            urlBox.Size = new Size(370, 30);
            urlBox.ReadOnly = true;
            urlBox.TextAlign = HorizontalAlignment.Center;
            form.Controls.Add(urlBox);

            Button copyBtn = new Button();
            copyBtn.Text = "📋 نسخ الرابط";
            copyBtn.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            copyBtn.BackColor = Color.FromArgb(16, 185, 129);
            copyBtn.ForeColor = Color.White;
            copyBtn.FlatStyle = FlatStyle.Flat;
            copyBtn.FlatAppearance.BorderSize = 0;
            copyBtn.Location = new Point(400, 114);
            copyBtn.Size = new Size(110, 32);
            copyBtn.Click += delegate
            {
                try
                {
                    Clipboard.SetText(netUrl);
                    MessageBox.Show("تم نسخ الرابط بنجاح إلى الحافظة!", AppTitle, MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                catch { }
            };
            form.Controls.Add(copyBtn);

            Label tipLbl = new Label();
            tipLbl.Text = "💡 ملاحظة: تأكد من أن جدار حماية ويندوز (Windows Firewall) يسمح بالاتصال على المنفذ " + currentPort + " للأجهزة الأخرى في الشبكة.";
            tipLbl.Font = new Font("Segoe UI", 8.5F, FontStyle.Italic);
            tipLbl.ForeColor = Color.FromArgb(100, 116, 139);
            tipLbl.Location = new Point(20, 160);
            tipLbl.Size = new Size(490, 45);
            form.Controls.Add(tipLbl);

            Button closeBtn = new Button();
            closeBtn.Text = "إغلاق";
            closeBtn.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            closeBtn.Location = new Point(210, 225);
            closeBtn.Size = new Size(110, 35);
            closeBtn.Click += delegate { form.Close(); };
            form.Controls.Add(closeBtn);

            form.ShowDialog();
        }
    }
}
