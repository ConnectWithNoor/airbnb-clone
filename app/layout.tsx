import { Nunito } from "next/font/google";

import "./globals.css";
import { ClientOnly, Navbar } from "./components";

export const metadata = {
  title: "Airbnb Clone - ConnectWithNoor",
  description:
    "Airbnb clone with all the functionalities of bookings, reservations, cancelations, filteration created by ConnectWithNoor",
};

const font = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <Navbar />
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
