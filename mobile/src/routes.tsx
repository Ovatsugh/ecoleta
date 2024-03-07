import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from "./pages/Home";
import Points from "./pages/Points";
import Detail from "./pages/Detail";

const AppStack = createNativeStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer >


            <AppStack.Navigator screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f0f0f5' }
            }} >
                <AppStack.Screen name="Home" component={Home} />
                <AppStack.Screen name="Points" component={Points} />
                <AppStack.Screen name="Detail" component={Detail} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}

export default Routes
