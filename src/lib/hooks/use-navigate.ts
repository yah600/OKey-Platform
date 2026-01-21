/**
 * Custom hook for navigation in the application
 * Handles navigation by updating the browser history and triggering a popstate event
 */
export function useNavigate() {
  return (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
}
