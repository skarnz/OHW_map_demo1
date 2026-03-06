import { useCallback, useRef } from 'react';
import { Platform, Linking, Alert } from 'react-native';
import { TaskCategory, NodeState } from '../game/contracts';
import { getRouteForTask, RouteTarget } from './routes';

export interface DeepLinkOptions {
  onNavigate?: (route: RouteTarget) => void;
  onCompleted?: (nodeId: string, category: TaskCategory) => void;
}

// Opens the native screen for a tapped task node.
// On native: attempts deep link via Linking API.
// On web: logs the route (host app wires actual navigation).
export function useDeepLink(options: DeepLinkOptions = {}) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const navigateToTask = useCallback(
    async (nodeId: string, category: TaskCategory, nodeState: NodeState) => {
      const route = getRouteForTask(category, nodeState, nodeId);
      if (!route) return;

      if (optionsRef.current.onNavigate) {
        optionsRef.current.onNavigate(route);
        return;
      }

      if (Platform.OS === 'web') {
        console.log(`[DeepLink] web route: ${route.path} (node=${nodeId})`);
        return;
      }

      try {
        const supported = await Linking.canOpenURL(route.deepLink);
        if (supported) {
          await Linking.openURL(route.deepLink);
        } else {
          // Host app not installed or scheme not registered -- show fallback
          console.warn(`[DeepLink] Cannot open: ${route.deepLink}`);
          Alert.alert(route.title, `Open ${route.title} for this task?`, [
            { text: 'OK', style: 'default' },
            { text: 'Cancel', style: 'cancel' },
          ]);
        }
      } catch (err) {
        console.error('[DeepLink] Navigation failed:', err);
      }
    },
    [],
  );

  return { navigateToTask };
}
