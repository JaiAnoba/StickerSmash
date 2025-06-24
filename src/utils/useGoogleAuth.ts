import * as React from 'react';
import * as AuthSession from 'expo-auth-session';
import { API_URL } from '../utils/env';

const discovery = {
  authorizationEndpoint: `${API_URL.replace('/auth', '')}/auth/google`,
};

export function useGoogleAuth() {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'stickersmash' });
  // Provide a dummy clientId (not used by backend, but required by hook)
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'dummy',
      redirectUri,
      usePKCE: false,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success' && response.url) {
      // Parse JWT token from the URL fragment or query
      const url = response.url;
      const match = url.match(/[&#?]token=([^&#]+)/);
      const token = match ? decodeURIComponent(match[1]) : null;
      // You can handle token here or return it from the hook
    }
  }, [response]);

  // You can parse the token from response.url in your component
  return { request, response, promptAsync };
}
