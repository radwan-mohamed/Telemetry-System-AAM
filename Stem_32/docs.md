# STM32 + Nextion (UART4) + Telemetry to Raspberry Pi (UART5)

This example sends dashboard data to a **Nextion HMI** over **UART4 @ 9600** and streams the same values as plain text (e.g., `speed=42`) to a **Raspberry Pi** via a **USB-UART (CH340) on UART5 @ 115200**.

---

## 1) Hardware Needed
- STM32 Nucleo/Discovery (any F4/F7/H7 etc. with **UART4** and **UART5**)
- **Nextion HMI** display (5V), with the matching HMI page/components
- **USB-UART (CH340)** module for the link to Raspberry Pi
- Jumper wires, common **GND** for all devices
- (Optional but recommended) **level shifter** or a simple resistor divider on **Nextion TX → STM32 RX** (Nextion is 5V-TTL; STM32 is 3.3V)

---

## 2) Wiring (Typical)
> Use pins available on *your* MCU. Below is a common STM32F4 mapping. Adjust in CubeMX if yours differs.

### UART4 ↔ Nextion (9600)
- **STM32 UART4_TX (e.g., PC10)** → **Nextion RX**
- **STM32 UART4_RX (e.g., PC11)** ← **Nextion TX**  *(use level shift to 3.3V)*
- **STM32 5V** → **Nextion 5V**
- **GND ↔ GND**

### UART5 ↔ CH340 ↔ Raspberry Pi (115200)
- **STM32 UART5_TX (e.g., PC12)** → **CH340 RX**
- **STM32 UART5_RX (e.g., PD2)**  ← **CH340 TX**
- **GND ↔ GND**
- CH340 goes to the Pi USB; it will appear as `/dev/ttyUSB0` (or similar)

---

## 3) Nextion Page (IDs & Names)
Create these components in your Nextion HMI (same **obj names** used by the code):
- `h0`  (slider/level)  ← **RPM**
- `n1`  (number)        ← **RPM**
- `n0`  (number)        ← **Speed**
- `n2`  (number)        ← **Gear**
- `n3`  (number)        ← **Temperature**
- `h1`  (slider/level)  ← **Fuel**

Pictures (by **pic ID** as in your HMI):
- `p0`: battery warning    → shows **ID 2**, hides **ID 3**
- `p1`: fuel warning       → shows **ID 4**, hides **ID 5**
- `p2`: temperature warn   → shows **ID 6**, hides **ID 7**
- `p3`: neutral gear “N”   → shows **ID 8**, hides **ID 9**

> The code sends standard Nextion commands and **always ends with `0xFF 0xFF 0xFF`**, so make sure your objects exist with these exact names/IDs.

---

## 4) CubeIDE Setup (Quick)
1. **Open STM32CubeIDE** → **New STM32 Project** → choose your MCU/board.
2. In **.ioc (CubeMX)**:
   - Enable **UART4**: **Asynchronous**, **Baud 9600**, 8N1  
     - Pick valid pins (e.g., TX=PC10, RX=PC11 on many F4s)
   - Enable **UART5**: **Asynchronous**, **Baud 115200**, 8N1  
     - Pins (e.g., TX=PC12, RX=PD2)
   - Leave DMA/interrupts **disabled** (blocking TX is fine for this demo).
3. **Generate Code**.

---

## 5) Drop in Your Code
- Replace the generated `main.c` with **your provided `main.c`** (or paste your functions in the *USER CODE* regions).
- Make sure the **baud rates** in:
  - `MX_UART4_Init()` = **9600**
  - `MX_UART5_Init()` = **115200**
- Build the project and **flash** to the board.

---

## 6) Run & Observe
- Power the **Nextion** (5V) and STM32; confirm **GND** common.
- The firmware continuously increments **speed/fuel/gear/temp** and:
  - Updates the **Nextion** via **UART4**.
  - Prints lines like `speed=XX`, `fuel=YY`, `gear=Z`, `temp=TT` via **UART5**.
- On the **Raspberry Pi**, verify telemetry:
  ```bash
  screen /dev/ttyUSB0 115200    # or: minicom -D /dev/ttyUSB0 -b 115200
  # You should see lines:
  # speed=7
  # fuel=14
  # gear=1
  # temp=25


---

## 7) Common Gotchas (1-minute check)

* **No Nextion updates?** Swap TX/RX, match **9600**, share **GND**, ensure objects exist (n0..n3, h0, h1, p0..p3).
* **Garbled text?** Baud mismatch; keep UART4=9600, UART5=115200.
* **Nothing on Pi?** Wrong port (try `/dev/ttyUSB1`), or TX/RX swapped to CH340.
* **Random resets/noise?** Power/ground quality; keep leads short; use the official 5V supply for Nextion.
* **5V vs 3.3V:** Protect **STM32 RX** from **Nextion TX (5V)** with a simple level shifter/divider.

---

## 8) What the Code Sends (Quick Map)

* **Nextion (UART4 @ 9600)**

  * `h0.val=<rpm>`; `n1.val=<rpm>`
  * `n0.val=<speed>`
  * `n2.val=<gear>`; shows/hides **N** with `p3.pic`
  * `n3.val=<temp>`
  * `h1.val=<fuel>`
  * Battery/Fuel/Temp warnings with `p0.pic`, `p1.pic`, `p2.pic`
* **Telemetry (UART5 @ 115200)**

  * `rpm=<v>\n`, `speed=<v>\n`, `gear=<v>\n`, `temp=<v>\n`, `fuel=<v>\n`




--- 
--- 

here just fouces on the uart5 and in the end integratwith the dashboard