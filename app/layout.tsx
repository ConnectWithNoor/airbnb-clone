import { Nunito } from "next/font/google";

import "./globals.css";
import {
  ClientOnly,
  LoginModal,
  Navbar,
  RegisterModal,
  RentModal,
} from "./components";
import ToasterProvider from "./providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";
import SearchModal from "./components/modals/SearchModal";

export const metadata = {
  title: "Airbnb Clone - ConnectWithNoor",
  description:
    "Airbnb clone with all the functionalities of bookings, reservations, cancelations, filteration created by ConnectWithNoor",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <RegisterModal />
          <LoginModal />
          <RentModal />
          <SearchModal />
          <Navbar currentUser={currentUser} />
          <ToasterProvider />
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
