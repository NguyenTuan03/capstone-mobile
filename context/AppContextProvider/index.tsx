import { BookingProvider } from "@/modules/learner/context/bookingContext";

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <BookingProvider>{children}</BookingProvider>;
};

export default AppContextProvider;
