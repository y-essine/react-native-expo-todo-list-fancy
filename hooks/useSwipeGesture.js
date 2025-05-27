// useSwipeGesture.js
import { Dimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, withTiming, runOnJS, Easing } from "react-native-reanimated";

const SWIPE_THRESHOLD = Dimensions.get("window").width * 0.25;
const VELOCITY_THRESHOLD = 800;

const useSwipeGesture = (translateX, currentIndex, setCurrentIndex, screensLength) => {
    const startX = useSharedValue(0);

    const updateIndex = (newIndex) => {
        if (newIndex >= 0 && newIndex < screensLength) {
            setCurrentIndex(newIndex);
            translateX.value = withTiming(-newIndex * Dimensions.get("window").width, {
                duration: 300,
                easing: Easing.ease,
            });
        } else {
            translateX.value = withTiming(-currentIndex * Dimensions.get("window").width, {
                duration: 300,
                easing: Easing.ease,
            });
        }
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate((event) => {
            translateX.value = startX.value + event.translationX;
        })
        .onEnd((event) => {
            const shouldSwipe =
                Math.abs(event.translationX) > SWIPE_THRESHOLD ||
                Math.abs(event.velocityX) > VELOCITY_THRESHOLD;

            if (shouldSwipe) {
                const newIndex =
                    event.translationX > 0
                        ? currentIndex - 1
                        : currentIndex + 1;
                runOnJS(updateIndex)(newIndex);
            } else {
                translateX.value = withTiming(-currentIndex * Dimensions.get("window").width, {
                    duration: 300,
                    easing: Easing.ease,
                });
            }
        });

    return panGesture;
};

export default useSwipeGesture;
