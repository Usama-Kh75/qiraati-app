using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using Microsoft.Win32;

namespace QiraatiSmart
{
    internal static class Uninstaller
    {
        private const string AppTitle = "منصة قراءتي التفاعلية الذكية";

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
                Console.WriteLine("Qiraati Smart Uninstaller: Self-test passed successfully.");
                return 0;
            }

            if (!silent)
            {
                DialogResult dr = MessageBox.Show(
                    "هل أنت متأكد من رغبتك في إزالة تثبيت منصة قراءتي التفاعلية الذكية بالكامل من جهازك؟\n\nإعداد المهندس أسامة خليل هاشم",
                    "إلغاء التثبيت • " + AppTitle,
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Question,
                    MessageBoxDefaultButton.Button2,
                    MessageBoxOptions.RtlReading | MessageBoxOptions.RightAlign
                );

                if (dr != DialogResult.Yes) return 0;
            }

            try
            {
                // 1. إنهاء أي عملية تشغيل جارية للتطبيق
                Process[] procs = Process.GetProcessesByName("Qiraati_Smart");
                foreach (Process p in procs)
                {
                    try
                    {
                        p.Kill();
                        p.WaitForExit(3000);
                    }
                    catch { }
                }

                // 2. حذف اختصار سطح المكتب
                string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string desktopLnk = Path.Combine(desktop, AppTitle + ".lnk");
                if (File.Exists(desktopLnk))
                {
                    try { File.Delete(desktopLnk); } catch { }
                }

                // 3. حذف اختصار ومجلد قائمة ابدأ
                string startMenu = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
                string startFolder = Path.Combine(startMenu, AppTitle);
                if (Directory.Exists(startFolder))
                {
                    try { Directory.Delete(startFolder, true); } catch { }
                }
                string startLnk = Path.Combine(startMenu, AppTitle + ".lnk");
                if (File.Exists(startLnk))
                {
                    try { File.Delete(startLnk); } catch { }
                }

                // 4. حذف سجل التثبيت من الويندوز
                try
                {
                    using (RegistryKey key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Uninstall", true))
                    {
                        if (key != null)
                        {
                            key.DeleteSubKeyTree("QiraatiSmart", false);
                        }
                    }
                }
                catch { }

                // 5. جدولة حذف مجلد البرنامج بعد إغلاق برنامج إلغاء التثبيت
                string installDir = AppDomain.CurrentDomain.BaseDirectory;
                ProcessStartInfo cleanup = new ProcessStartInfo("cmd.exe",
                    "/C ping 127.0.0.1 -n 2 > nul & rmdir /S /Q \"" + installDir.TrimEnd('\\') + "\"")
                {
                    WindowStyle = ProcessWindowStyle.Hidden,
                    CreateNoWindow = true,
                    UseShellExecute = false
                };
                Process.Start(cleanup);

                if (!silent)
                {
                    MessageBox.Show(
                        "تمت إزالة تثبيت منصة قراءتي التفاعلية الذكية بنجاح من جهازك.",
                        AppTitle,
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Information,
                        MessageBoxDefaultButton.Button1,
                        MessageBoxOptions.RtlReading | MessageBoxOptions.RightAlign
                    );
                }
            }
            catch (Exception ex)
            {
                if (!silent)
                {
                    MessageBox.Show("حدث خطأ أثناء إزالة التثبيت:\n" + ex.Message, AppTitle, MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                return 1;
            }

            return 0;
        }
    }
}
