using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;

namespace QiraatiSmart
{
    internal static class SetupWizard
    {
        private const string AppTitle = "منصة قراءتي التفاعلية الذكية";
        private const string AppVersion = "3.64.0";
        private const string AppPublisher = "إعداد المهندس أسامة خليل هاشم";

        [DllImport("kernel32.dll")]
        private static extern bool AttachConsole(int processId);

        [STAThread]
        private static int Main(string[] args)
        {
            bool selfTest = false;
            bool silent = false;

            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == "--self-test") selfTest = true;
                if (args[i] == "/S" || args[i] == "--silent") silent = true;
            }

            if (selfTest)
            {
                AttachConsole(-1);
                try
                {
                    using (Stream s = Assembly.GetExecutingAssembly().GetManifestResourceStream("app_bundle.zip"))
                    {
                        if (s == null)
                        {
                            Console.WriteLine("Qiraati Smart Setup: Self-test failed - app_bundle.zip resource not found.");
                            return 1;
                        }
                        using (ZipArchive zip = new ZipArchive(s, ZipArchiveMode.Read))
                        {
                            Console.WriteLine("Qiraati Smart Setup: Self-test passed successfully. Entries in bundle: " + zip.Entries.Count);
                        }
                    }
                    return 0;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Qiraati Smart Setup: Self-test error: " + ex.Message);
                    return 1;
                }
            }

            string defaultTarget = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Programs", "QiraatiSmart"
            );

            if (silent)
            {
                return PerformInstallation(defaultTarget, true, true, false, null, null);
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new WizardForm(defaultTarget));

            return 0;
        }

        public static int PerformInstallation(
            string targetDir,
            bool createDesktopLnk,
            bool createStartMenuLnk,
            bool launchAfter,
            Action<int, string> progressCallback,
            IWin32Window owner)
        {
            try
            {
                Directory.CreateDirectory(targetDir);

                // 1. استخراج ملفات الحزمة
                using (Stream resStream = Assembly.GetExecutingAssembly().GetManifestResourceStream("app_bundle.zip"))
                {
                    if (resStream == null)
                    {
                        throw new InvalidOperationException("تعذر العثور على ملفات حزمة التطبيق المدمجة.");
                    }

                    using (ZipArchive zip = new ZipArchive(resStream, ZipArchiveMode.Read))
                    {
                        int total = zip.Entries.Count;
                        int current = 0;

                        foreach (ZipArchiveEntry entry in zip.Entries)
                        {
                            current++;
                            string entryName = entry.FullName.Replace('/', Path.DirectorySeparatorChar);
                            string destPath = Path.Combine(targetDir, entryName);

                            if (entry.FullName.EndsWith("/") || entry.FullName.EndsWith("\\"))
                            {
                                Directory.CreateDirectory(destPath);
                            }
                            else
                            {
                                Directory.CreateDirectory(Path.GetDirectoryName(destPath));
                                using (Stream inStream = entry.Open())
                                using (FileStream outStream = new FileStream(destPath, FileMode.Create, FileAccess.Write, FileShare.None))
                                {
                                    byte[] buf = new byte[64 * 1024];
                                    int read;
                                    while ((read = inStream.Read(buf, 0, buf.Length)) > 0)
                                    {
                                        outStream.Write(buf, 0, read);
                                    }
                                }
                            }

                            if (progressCallback != null)
                            {
                                int pct = (int)((current * 100.0) / total);
                                progressCallback(pct, entry.Name);
                            }
                        }
                    }
                }

                // 2. إنشاء الاختصارات
                string mainExe = Path.Combine(targetDir, "Qiraati_Smart.exe");
                string iconFile = Path.Combine(targetDir, "icons", "qiraati.ico");
                if (!File.Exists(iconFile)) iconFile = mainExe;

                if (createDesktopLnk)
                {
                    string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                    string lnkPath = Path.Combine(desktop, AppTitle + ".lnk");
                    CreateShortcut(lnkPath, mainExe, targetDir, iconFile, AppTitle + " - " + AppPublisher);
                }

                if (createStartMenuLnk)
                {
                    string programs = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
                    string menuFolder = Path.Combine(programs, AppTitle);
                    Directory.CreateDirectory(menuFolder);

                    string lnkMain = Path.Combine(menuFolder, AppTitle + ".lnk");
                    CreateShortcut(lnkMain, mainExe, targetDir, iconFile, AppTitle + " - " + AppPublisher);

                    string uninstallerExe = Path.Combine(targetDir, "Uninstall.exe");
                    if (File.Exists(uninstallerExe))
                    {
                        string lnkUninst = Path.Combine(menuFolder, "إلغاء تثبيت منصة قراءتي.lnk");
                        CreateShortcut(lnkUninst, uninstallerExe, targetDir, uninstallerExe, "إلغاء تثبيت " + AppTitle);
                    }
                }

                // 3. التسجيل في نظام ويندوز لإضافة وحذف البرامج
                RegisterInWindows(targetDir, mainExe, iconFile);

                // 4. تشغيل التطبيق إذا تم تحديد ذلك
                if (launchAfter && File.Exists(mainExe))
                {
                    try
                    {
                        Process.Start(new ProcessStartInfo(mainExe) { WorkingDirectory = targetDir });
                    }
                    catch { }
                }

                return 0;
            }
            catch (Exception ex)
            {
                if (owner != null)
                {
                    MessageBox.Show(owner, "حدث خطأ أثناء التثبيت:\n" + ex.Message, AppTitle, MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                return 1;
            }
        }

        private static void CreateShortcut(string shortcutPath, string targetExe, string workingDir, string iconLocation, string description)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType == null) return;
                object shell = Activator.CreateInstance(shellType);
                object shortcut = shellType.InvokeMember("CreateShortcut", BindingFlags.InvokeMethod, null, shell, new object[] { shortcutPath });
                Type shortcutType = shortcut.GetType();

                shortcutType.InvokeMember("TargetPath", BindingFlags.SetProperty, null, shortcut, new object[] { targetExe });
                shortcutType.InvokeMember("WorkingDirectory", BindingFlags.SetProperty, null, shortcut, new object[] { workingDir });
                shortcutType.InvokeMember("IconLocation", BindingFlags.SetProperty, null, shortcut, new object[] { iconLocation + ",0" });
                shortcutType.InvokeMember("Description", BindingFlags.SetProperty, null, shortcut, new object[] { description });
                shortcutType.InvokeMember("Save", BindingFlags.InvokeMethod, null, shortcut, null);

                Marshal.ReleaseComObject(shortcut);
                Marshal.ReleaseComObject(shell);
            }
            catch { }
        }

        private static void RegisterInWindows(string targetDir, string mainExe, string iconFile)
        {
            try
            {
                string keyPath = @"Software\Microsoft\Windows\CurrentVersion\Uninstall\QiraatiSmart";
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(keyPath))
                {
                    if (key != null)
                    {
                        key.SetValue("DisplayName", AppTitle + " - الصف الأول الابتدائي");
                        key.SetValue("DisplayVersion", AppVersion);
                        key.SetValue("Publisher", AppPublisher);
                        key.SetValue("InstallLocation", targetDir);
                        key.SetValue("DisplayIcon", iconFile);
                        key.SetValue("UninstallString", "\"" + Path.Combine(targetDir, "Uninstall.exe") + "\"");
                        key.SetValue("URLInfoAbout", "https://usama-kh75.github.io/qiraati-app/");
                        key.SetValue("NoModify", 1, RegistryValueKind.DWord);
                        key.SetValue("NoRepair", 1, RegistryValueKind.DWord);
                    }
                }
            }
            catch { }
        }

        public class WizardForm : Form
        {
            private string targetDir;
            private Panel headerPanel;
            private Label lblHeaderTitle;
            private Label lblHeaderSub;
            private Panel pageWelcome;
            private Panel pageOptions;
            private Panel pageProgress;
            private Panel pageFinish;
            private Button btnBack;
            private Button btnNext;
            private Button btnCancel;
            private TextBox txtPath;
            private CheckBox chkDesktop;
            private CheckBox chkStartMenu;
            private CheckBox chkLaunch;
            private ProgressBar progressBar;
            private Label lblProgressStatus;
            private int currentStep = 1;

            public WizardForm(string defaultTarget)
            {
                targetDir = defaultTarget;
                InitializeComponents();
                ShowStep(1);
            }

            private void InitializeComponents()
            {
                this.Text = "تثبيت " + AppTitle + " • " + AppPublisher;
                this.RightToLeft = RightToLeft.Yes;
                this.RightToLeftLayout = true;
                this.Size = new Size(640, 480);
                this.StartPosition = FormStartPosition.CenterScreen;
                this.FormBorderStyle = FormBorderStyle.FixedDialog;
                this.MaximizeBox = false;
                this.MinimizeBox = false;
                this.BackColor = Color.White;
                this.Font = new Font("Segoe UI", 9.5F, FontStyle.Regular);

                try
                {
                    this.Icon = Icon.ExtractAssociatedIcon(Assembly.GetExecutingAssembly().Location);
                }
                catch { }

                // الهيدر العلوي الأنيق
                headerPanel = new Panel();
                headerPanel.Dock = DockStyle.Top;
                headerPanel.Height = 70;
                headerPanel.BackColor = Color.FromArgb(30, 58, 138);

                lblHeaderTitle = new Label();
                lblHeaderTitle.Text = AppTitle;
                lblHeaderTitle.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
                lblHeaderTitle.ForeColor = Color.White;
                lblHeaderTitle.Location = new Point(20, 12);
                lblHeaderTitle.AutoSize = true;
                headerPanel.Controls.Add(lblHeaderTitle);

                lblHeaderSub = new Label();
                lblHeaderSub.Text = "الصف الأول الابتدائي • " + AppPublisher;
                lblHeaderSub.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
                lblHeaderSub.ForeColor = Color.FromArgb(224, 231, 255);
                lblHeaderSub.Location = new Point(20, 38);
                lblHeaderSub.AutoSize = true;
                headerPanel.Controls.Add(lblHeaderSub);

                this.Controls.Add(headerPanel);

                // شريط الأزرار السفلي
                Panel footerPanel = new Panel();
                footerPanel.Dock = DockStyle.Bottom;
                footerPanel.Height = 55;
                footerPanel.BackColor = Color.FromArgb(241, 245, 249);

                btnCancel = new Button();
                btnCancel.Text = "إلغاء الأمر";
                btnCancel.Location = new Point(20, 12);
                btnCancel.Size = new Size(95, 32);
                btnCancel.Click += delegate { this.Close(); };
                footerPanel.Controls.Add(btnCancel);

                btnNext = new Button();
                btnNext.Text = "التالي >";
                btnNext.Location = new Point(510, 12);
                btnNext.Size = new Size(95, 32);
                btnNext.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);
                btnNext.BackColor = Color.FromArgb(16, 185, 129);
                btnNext.ForeColor = Color.White;
                btnNext.FlatStyle = FlatStyle.Flat;
                btnNext.FlatAppearance.BorderSize = 0;
                btnNext.Click += delegate { OnNextClicked(); };
                footerPanel.Controls.Add(btnNext);

                btnBack = new Button();
                btnBack.Text = "< السابق";
                btnBack.Location = new Point(405, 12);
                btnBack.Size = new Size(95, 32);
                btnBack.Click += delegate { OnBackClicked(); };
                footerPanel.Controls.Add(btnBack);

                this.Controls.Add(footerPanel);

                // صفحة 1: الترحيب
                pageWelcome = new Panel();
                pageWelcome.Dock = DockStyle.Fill;
                pageWelcome.Padding = new Padding(30, 20, 30, 20);

                Label lblW1 = new Label();
                lblW1.Text = "مرحباً بكم في معالج تثبيت " + AppTitle;
                lblW1.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
                lblW1.ForeColor = Color.FromArgb(30, 58, 138);
                lblW1.Location = new Point(30, 20);
                lblW1.Size = new Size(560, 30);
                pageWelcome.Controls.Add(lblW1);

                Label lblW2 = new Label();
                lblW2.Text = "يقوم هذا المعالج بتثبيت منصة قراءتي التفاعلية الذكية كاملة على حاسوبك.\n\n" +
                    "✨ الميزات الرئيسية للحزمة المكتبية:\n" +
                    "• العمل الكامل بدون إنترنت (100% أوفلاين) دون الحاجة لأي شبكة.\n" +
                    "• التوافقية الشاملة مع الشاشات الذكية والسبورات التفاعلية والحواسيب.\n" +
                    "• تغطية كافة دروس ووحدات المنهج الـ 46 وبنك الألعاب ومختبر الخط العربي.\n" +
                    "• أكثر من 2,900 تسجيلاً صوتياً نقياً بصوت الأستاذ باسل العراقي الفصيح ومكتبة الفونيمات النقية للـ 28 حرفاً مع خط Tajawal المحلي.\n\n" +
                    "اضغط على «التالي» للمتابعة وتحديد خيارات التثبيت.";
                lblW2.Location = new Point(30, 60);
                lblW2.Size = new Size(560, 230);
                lblW2.ForeColor = Color.FromArgb(51, 65, 85);
                lblW2.Font = new Font("Segoe UI", 10F, FontStyle.Regular);
                pageWelcome.Controls.Add(lblW2);

                this.Controls.Add(pageWelcome);

                // صفحة 2: مسار التثبيت والخيارات
                pageOptions = new Panel();
                pageOptions.Dock = DockStyle.Fill;
                pageOptions.Padding = new Padding(30, 20, 30, 20);

                Label lblOptTitle = new Label();
                lblOptTitle.Text = "تحديد مسار التثبيت والخيارات:";
                lblOptTitle.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
                lblOptTitle.ForeColor = Color.FromArgb(30, 58, 138);
                lblOptTitle.Location = new Point(30, 15);
                lblOptTitle.Size = new Size(560, 25);
                pageOptions.Controls.Add(lblOptTitle);

                Label lblPathDesc = new Label();
                lblPathDesc.Text = "سيتم تثبيت ملفات المنصة في المجلد التالي:";
                lblPathDesc.Location = new Point(30, 45);
                lblPathDesc.Size = new Size(560, 20);
                pageOptions.Controls.Add(lblPathDesc);

                txtPath = new TextBox();
                txtPath.Text = targetDir;
                txtPath.Location = new Point(30, 70);
                txtPath.Size = new Size(460, 28);
                pageOptions.Controls.Add(txtPath);

                Button btnBrowse = new Button();
                btnBrowse.Text = "استعراض...";
                btnBrowse.Location = new Point(500, 69);
                btnBrowse.Size = new Size(90, 29);
                btnBrowse.Click += delegate
                {
                    using (FolderBrowserDialog fbd = new FolderBrowserDialog())
                    {
                        fbd.Description = "اختر مجلد تثبيت منصة قراءتي التفاعلية:";
                        fbd.SelectedPath = txtPath.Text;
                        if (fbd.ShowDialog(this) == DialogResult.OK)
                        {
                            txtPath.Text = fbd.SelectedPath;
                        }
                    }
                };
                pageOptions.Controls.Add(btnBrowse);

                GroupBox grpOptions = new GroupBox();
                grpOptions.Text = "اختصارات وإعدادات التشغيل:";
                grpOptions.Location = new Point(30, 120);
                grpOptions.Size = new Size(560, 140);

                chkDesktop = new CheckBox();
                chkDesktop.Text = "إنشاء اختصار على سطح المكتب (Desktop Shortcut)";
                chkDesktop.Checked = true;
                chkDesktop.Location = new Point(20, 30);
                chkDesktop.Size = new Size(520, 25);
                grpOptions.Controls.Add(chkDesktop);

                chkStartMenu = new CheckBox();
                chkStartMenu.Text = "إنشاء اختصار في قائمة ابدأ (Start Menu Shortcut)";
                chkStartMenu.Checked = true;
                chkStartMenu.Location = new Point(20, 65);
                chkStartMenu.Size = new Size(520, 25);
                grpOptions.Controls.Add(chkStartMenu);

                chkLaunch = new CheckBox();
                chkLaunch.Text = "تشغيل منصة قراءتي فور اكتمال التثبيت";
                chkLaunch.Checked = true;
                chkLaunch.Location = new Point(20, 100);
                chkLaunch.Size = new Size(520, 25);
                grpOptions.Controls.Add(chkLaunch);

                pageOptions.Controls.Add(grpOptions);
                this.Controls.Add(pageOptions);

                // صفحة 3: شريط التقدم
                pageProgress = new Panel();
                pageProgress.Dock = DockStyle.Fill;
                pageProgress.Padding = new Padding(30, 20, 30, 20);

                Label lblProgTitle = new Label();
                lblProgTitle.Text = "جارٍ استخراج وتثبيت ملفات المنصة التفاعلية...";
                lblProgTitle.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
                lblProgTitle.ForeColor = Color.FromArgb(30, 58, 138);
                lblProgTitle.Location = new Point(30, 40);
                lblProgTitle.Size = new Size(560, 30);
                pageProgress.Controls.Add(lblProgTitle);

                progressBar = new ProgressBar();
                progressBar.Location = new Point(30, 85);
                progressBar.Size = new Size(560, 25);
                progressBar.Style = ProgressBarStyle.Continuous;
                pageProgress.Controls.Add(progressBar);

                lblProgressStatus = new Label();
                lblProgressStatus.Text = "جارٍ التهيئة...";
                lblProgressStatus.Location = new Point(30, 120);
                lblProgressStatus.Size = new Size(560, 40);
                lblProgressStatus.ForeColor = Color.FromArgb(100, 116, 139);
                pageProgress.Controls.Add(lblProgressStatus);

                this.Controls.Add(pageProgress);

                // صفحة 4: النهاية
                pageFinish = new Panel();
                pageFinish.Dock = DockStyle.Fill;
                pageFinish.Padding = new Padding(30, 20, 30, 20);

                Label lblFinTitle = new Label();
                lblFinTitle.Text = "🎉 تم التثبيت بنجاح!";
                lblFinTitle.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
                lblFinTitle.ForeColor = Color.FromArgb(16, 185, 129);
                lblFinTitle.Location = new Point(30, 30);
                lblFinTitle.Size = new Size(560, 35);
                pageFinish.Controls.Add(lblFinTitle);

                Label lblFinMsg = new Label();
                lblFinMsg.Text = "تم تثبيت " + AppTitle + " بنجاح على جهازك.\n\n" +
                    "المنصة الآن جاهزة تماماً للعمل 100% أوفلاين في أي وقت.\n" +
                    "يمكنك تشغيلها عبر الاختصار الموجود على سطح المكتب أو قائمة ابدأ.\n\n" +
                    "👨‍💻 إعداد وتطوير: " + AppPublisher;
                lblFinMsg.Font = new Font("Segoe UI", 10.5F, FontStyle.Regular);
                lblFinMsg.ForeColor = Color.FromArgb(51, 65, 85);
                lblFinMsg.Location = new Point(30, 80);
                lblFinMsg.Size = new Size(560, 160);
                pageFinish.Controls.Add(lblFinMsg);

                this.Controls.Add(pageFinish);
            }

            private void ShowStep(int step)
            {
                currentStep = step;
                pageWelcome.Visible = (step == 1);
                pageOptions.Visible = (step == 2);
                pageProgress.Visible = (step == 3);
                pageFinish.Visible = (step == 4);

                btnBack.Enabled = (step == 2);
                btnBack.Visible = (step <= 2);

                if (step == 1)
                {
                    btnNext.Text = "التالي >";
                    btnNext.Enabled = true;
                    btnNext.Visible = true;
                    btnCancel.Enabled = true;
                }
                else if (step == 2)
                {
                    btnNext.Text = "تثبيت";
                    btnNext.Enabled = true;
                    btnNext.Visible = true;
                    btnCancel.Enabled = true;
                }
                else if (step == 3)
                {
                    btnNext.Visible = false;
                    btnBack.Visible = false;
                    btnCancel.Enabled = false;
                }
                else if (step == 4)
                {
                    btnNext.Text = "إنهاء";
                    btnNext.Visible = true;
                    btnNext.Enabled = true;
                    btnBack.Visible = false;
                    btnCancel.Visible = false;
                }
            }

            private void OnNextClicked()
            {
                if (currentStep == 1)
                {
                    ShowStep(2);
                }
                else if (currentStep == 2)
                {
                    targetDir = txtPath.Text.Trim();
                    if (string.IsNullOrEmpty(targetDir))
                    {
                        MessageBox.Show(this, "يرجى تحديد مسار مجلد التثبيت.", AppTitle, MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        return;
                    }
                    ShowStep(3);
                    StartInstallationBackground();
                }
                else if (currentStep == 4)
                {
                    this.Close();
                }
            }

            private void OnBackClicked()
            {
                if (currentStep == 2)
                {
                    ShowStep(1);
                }
            }

            private void StartInstallationBackground()
            {
                bool dLnk = chkDesktop.Checked;
                bool sLnk = chkStartMenu.Checked;
                bool lAfter = chkLaunch.Checked;

                BackgroundWorker worker = new BackgroundWorker();
                worker.WorkerReportsProgress = true;
                worker.DoWork += delegate(object s, DoWorkEventArgs e)
                {
                    int res = PerformInstallation(targetDir, dLnk, sLnk, lAfter, (pct, file) =>
                    {
                        worker.ReportProgress(pct, file);
                    }, null);
                    e.Result = res;
                };

                worker.ProgressChanged += delegate(object s, ProgressChangedEventArgs e)
                {
                    progressBar.Value = Math.Min(100, Math.Max(0, e.ProgressPercentage));
                    string fname = e.UserState as string;
                    if (!string.IsNullOrEmpty(fname))
                    {
                        lblProgressStatus.Text = "استخراج: " + fname;
                    }
                };

                worker.RunWorkerCompleted += delegate(object s, RunWorkerCompletedEventArgs e)
                {
                    if (e.Result is int && (int)e.Result == 0)
                    {
                        ShowStep(4);
                    }
                    else
                    {
                        MessageBox.Show(this, "فشل اكتمال التثبيت.", AppTitle, MessageBoxButtons.OK, MessageBoxIcon.Error);
                        this.Close();
                    }
                };

                worker.RunWorkerAsync();
            }
        }
    }
}
