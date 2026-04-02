import { ThemeProvider } from 'next-themes';
import { AppProvider } from '../context/AppContext';
import './globals.css';

export const metadata = {
  title: 'FinFlow — Finance Dashboard',
  description: 'Premium personal finance dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppProvider>{children}</AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
