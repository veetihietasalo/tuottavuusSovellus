import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Dashboard from './Dashboard';
import TaskList from './TaskList';
import TaskCalendar from './TaskCalendar';
const Tab = createBottomTabNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
        <Tab.Navigator
            screenOptions={({ route }) => ({ // Navigator can be customized using screenOptions
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Dashboard') {
                iconName = 'md-home';
                } else if (route.name === 'Tasks') {
                iconName = 'md-checkbox';
                } else if (route.name === 'Calendar')
                iconName = 'md-calendar';
                return <Ionicons name={iconName} size={size} color={color} />; //it returns an icon component
                },
                })}>
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Tasks" component={TaskList} />
            <Tab.Screen name="Calendar" component={TaskCalendar}/>
        </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
