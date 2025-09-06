import { View } from "react-native";

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {   
    return (
        <View>
            {children}
        </View>
    )
}

export default AppContextProvider;