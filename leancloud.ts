
import AV from 'leancloud-storage';
import { Realtime } from 'leancloud-realtime';

// TODO: Replace with your LeanCloud (TDS) App credentials
// Register at https://console.leancloud.cn/
const appId = 'YOUR_LEANCLOUD_APP_ID';
const appKey = 'YOUR_LEANCLOUD_APP_KEY';
const serverURL = 'https://your-custom-domain.api.lncldglobal.com'; // or the specialized domain provided by LeanCloud

// Initialize LeanCloud Storage
AV.init({
  appId,
  appKey,
  serverURL
});

// Initialize LiveQuery (for Realtime updates)
// We create a generic LiveQuery client
// Note: In a browser environment via ESM, LiveQuery is integrated into AV.Query in recent versions,
// but explicitly ensuring the Realtime adapter is safe.
// For simple usage in this demo, we rely on the storage SDK's built-in handling.

export default AV;
