import Animated from "react-native-reanimated";

export function HelloWave() {
  const animatedStyle = {
    animationName: {
      "50%": { transform: [{ rotate: "25deg" }] },
    },
    animationIterationCount: 4,
    animationDuration: "300ms",
  } as const;

  return (
    <Animated.Text style={[styles.text, animatedStyle]}>
      👋
    </Animated.Text>
  );
}
