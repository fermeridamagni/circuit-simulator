# Testing Guide for PIC16 Circuit Simulator

## Phase 1: Wire Connection Testing

### Prerequisites
- Development server running: `npm run dev`
- Browser opened at `http://localhost:5173`

### Test 1: Basic Wire Connection Between Components

**Objective:** Verify that wires can be created between component pins

**Steps:**
1. Open the application
2. Click on the LED component on the canvas (top-left area)
   - **Expected:** LED component is selected (blue dashed border appears)
   - **Expected:** Pin circles become visible on the component
3. Click on the LED's Cathode pin (right side pin)
   - **Expected:** Properties panel shows "Wiring Mode"
   - **Expected:** Properties panel displays the starting pin ID
   - **Expected:** Cursor changes to pointer
   - **Expected:** All component pins become visible
4. Click on one of the Resistor's pins (component below the LED)
   - **Expected:** A black line (wire) appears connecting the two pins
   - **Expected:** Both connected pins turn green
   - **Expected:** Wire connection points show green markers
   - **Expected:** Wiring mode exits automatically
   - **Expected:** Properties panel returns to default state

**Success Criteria:**
- ✅ Wire is visible as a black line
- ✅ Connected pins are green
- ✅ Wire has green connection markers at both ends
- ✅ No console errors

### Test 2: Wire Cancellation

**Objective:** Verify that wiring mode can be cancelled

**Steps:**
1. Click on any component pin to start wiring mode
   - **Expected:** "Wiring Mode" appears in Properties panel
2. Click the "Cancel Wiring" button in the Properties panel
   - **Expected:** Wiring mode is cancelled
   - **Expected:** Properties panel returns to default state
   - **Expected:** No wire is created

**Success Criteria:**
- ✅ Wiring mode cancelled successfully
- ✅ No wire created
- ✅ UI returns to normal state

### Test 3: Wire Persistence with Component Movement

**Objective:** Verify that wires follow components when they are moved

**Steps:**
1. Create a wire between LED and Resistor (follow Test 1 steps)
2. Click and drag the LED to a new position
   - **Expected:** Wire remains connected to the LED pin
   - **Expected:** Wire updates in real-time as component moves
   - **Expected:** Wire adjusts its path to connect to the new position
3. Click and drag the Resistor to a new position
   - **Expected:** Wire remains connected to both components
   - **Expected:** Wire updates smoothly
4. Move both components multiple times
   - **Expected:** Wire always stays connected
   - **Expected:** No visual glitches or disconnections

**Success Criteria:**
- ✅ Wires follow components when moved
- ✅ Connections remain valid
- ✅ No visual artifacts
- ✅ Smooth real-time updates

### Test 4: Invalid Connection Attempts

**Objective:** Verify that invalid connections are rejected

**Steps:**
1. Click on a pin of the LED
2. Try to click on another pin of the same LED
   - **Expected:** No wire is created
   - **Expected:** Wiring mode exits
3. Try to connect a pin to itself
   - **Expected:** No wire is created
   - **Expected:** Wiring mode exits

**Success Criteria:**
- ✅ Cannot connect pins on the same component
- ✅ Cannot connect a pin to itself
- ✅ No console errors

### Test 5: Multiple Wire Connections

**Objective:** Verify that multiple wires can be created

**Steps:**
1. Add a third component (e.g., Capacitor) to the canvas
2. Create a wire from LED to Resistor
3. Create a wire from Resistor to Capacitor
4. Create a wire from Capacitor to LED
   - **Expected:** All three wires are visible
   - **Expected:** All connections are maintained
   - **Expected:** Moving any component updates all connected wires

**Success Criteria:**
- ✅ Multiple wires can coexist
- ✅ All wires update correctly when components move
- ✅ Performance remains smooth

## Known Issues Fixed

### Issue 1: Stale Closure in Wire Creation
**Problem:** The `completeWiring` function in `useCircuit.ts` had `circuit.components` in its dependency array, causing it to use stale component data.

**Solution:** Refactored to use functional `setState` update, accessing fresh component data from the `prev` state parameter.

**Code Change:**
```typescript
// Before (BROKEN):
const completeWiring = useCallback((secondPinId: string) => {
  const firstPin = circuit.components.find(...); // Uses stale data!
  // ...
}, [firstPinId, circuit.components, setCircuit]); // Stale closure!

// After (FIXED):
const completeWiring = useCallback((secondPinId: string) => {
  setCircuit(prev => {
    const firstPin = prev.components.find(...); // Uses fresh data!
    // ...
  });
}, [firstPinId]); // No stale closure!
```

### Issue 2: Konva Grid Line Warnings
**Problem:** Grid lines used lowercase `<line>` elements instead of Konva's `<Line>` component.

**Solution:** Changed to use Konva's `<Line>` component with `points` prop.

**Code Change:**
```tsx
// Before (BROKEN):
<line x1={x} y1={startY} x2={x} y2={endY} />

// After (FIXED):
<Line points={[x, startY, x, endY]} />
```

## Performance Testing

### Test 6: Performance with Many Wires
1. Create 10+ wire connections
2. Move components with multiple connections
3. Monitor console for performance warnings
4. Check frame rate remains smooth

**Success Criteria:**
- ✅ UI remains responsive with 10+ wires
- ✅ No visible lag when dragging components
- ✅ No console warnings about performance

## Browser Compatibility

Test the above scenarios in:
- ✅ Chrome/Edge (Chromium-based)
- ✅ Firefox
- ✅ Safari (if available)

## Automated Testing

Currently, the project uses manual testing. Future enhancements should include:
- Unit tests for `useCircuit` hook
- Integration tests for wire creation workflow
- E2E tests with Playwright for full user flows

