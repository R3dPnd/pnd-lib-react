// Components
export { Button, type ButtonProps, type ButtonVariant } from "./components/Button";
export { Chip, Tag, type Tone } from "./components/Chip";
export { CopyButton } from "./components/CopyButton";
export { Avatar, Banner, EmptyState, Panel, StatusBadge, Timestamp, TypingIndicator, type PanelProps } from "./components/basics";
export {
  Checkbox,
  Select,
  TextField,
  TextInput,
  type CheckboxProps,
  type SelectProps,
  type TextFieldProps,
  type TextInputProps,
} from "./components/forms";
export { Segmented, Tabs, type SegmentedProps, type Tab, type TabsProps } from "./components/Tabs";
export { DisplaySettings } from "./components/DisplaySettings";

// Hooks
export { useDisplay, type DisplayState } from "./hooks/useDisplay";
export { readHashRoute, useHashRoute } from "./hooks/useHashRoute";
export { useLoad } from "./hooks/useLoad";

// Display prefs
export {
  applyResolved,
  applySavedDisplay,
  browserDisplay,
  clampScale,
  DEFAULT_PREFS,
  describeDisplay,
  loadPrefs,
  localStorageHost,
  profileOf,
  resolve,
  sanitizePrefs,
  SCALE_MAX,
  SCALE_MIN,
  SCALE_STEP,
  type Density,
  type DisplayHost,
  type DisplayInfo,
  type Effects,
  type Font,
  type Prefs,
  type Profile,
  type Resolved,
} from "./display";

// Utilities
export { getJson, postJson } from "./fetch";
export { fmtTime, relTime } from "./format";
