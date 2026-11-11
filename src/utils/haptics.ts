/**
 * Android Haptic Feedback Helper
 * Uses navigator.vibrate when supported on mobile Android devices.
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(12);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate(45);
        break;
      case 'success':
        navigator.vibrate([15, 60, 25]);
        break;
      case 'warning':
        navigator.vibrate([25, 40, 25, 40]);
        break;
    }
  } catch {
    // Vibration ignored if blocked by user permissions
  }
}
