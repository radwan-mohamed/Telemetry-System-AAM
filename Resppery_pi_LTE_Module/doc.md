
## Step-by-Step: Raspberry Pi + Waveshare SIM7600X + STM32

> This follows the tutorial here and adapts it to our setup (Orange SIM, Python sender, STM32 on a separate USB-UART). See the video for a visual walkthrough. 

### What you need
- **Raspberry Pi** (Pi 4 or Pi 5) with the **official power supply**  
  - Pi 5 → Official **27W USB-C (5.1 V/5 A)**. 
  - Pi 4 → Official **15W USB-C (5.1 V/3 A)**. 
- **Waveshare SIM7600X 4G HAT** (or SIM7600G-H/E-H variant) with LTE + GNSS antennas attached.
- **Nano-SIM (Orange)** with data plan active.
- **USB-to-TTL UART (CH340)** for the **STM32** (so the HAT can use the Pi’s UART or USB independently).
- A microSD with Raspberry Pi OS (use **Raspberry Pi Imager** to flash).

### Hardware hookup
1. Power off the Pi. Insert the **Nano-SIM** in the HAT. Connect LTE (MAIN) and GNSS antennas.
2. Seat the HAT on the Pi’s GPIO header (or use the HAT’s **USB** cable to the Pi if you’ll use USB mode).
3. Plug the **CH340** into the Pi for the **STM32** link. (This keeps a second, independent serial for STM32.)
4. Power the Pi with its **official PSU** (don’t power the HAT from random USB ports).
5. On the HAT, press/hold **PWRKEY** if required until the **PWR** LED comes on. The **NET** LED will start indicating network tatus once registered (slow blink/heartbeat).

###  OS prep (first boot)
```bash
sudo apt update && sudo apt -y full-upgrade
sudo apt -y install git python3-pip minicom screen modemmanager network-manager
```
###  OS prep (first boot)

Check the [newlast.py] and install it in the resppery

---
---


## Resources

### Official Docs & Software
- **Waveshare Wiki — SIM7600E-H 4G HAT**: https://www.waveshare.com/wiki/SIM7600E-H_4G_HAT  
- **Raspberry Pi Imager (OS flashing tool)**: https://www.raspberrypi.com/software/

### Step-by-Step Guides
- **Core Electronics: Raspberry Pi 4G/GNSS HAT Guide**: https://core-electronics.com.au/guides/raspberry-pi/raspberry-pi-4g-gps-hat/

### Video Tutorials
- **YouTube tutorial #1 (SIM7600 / RPi setup)**: https://www.youtube.com/watch?v=ABnwz-IYzqA  
- **YouTube tutorial #2 (cellular modem on Pi)**: https://www.youtube.com/watch?v=kP2S3JUH-qk  
- **YouTube tutorial #3 (PPP/4G data on Pi)**: https://www.youtube.com/watch?v=ykTlNf1TXO0

### Tools & Adapters
- **USB-to-TTL UART (CH340) uploader module**: https://makerselectronics.com/product/usb-to-ttl-uart-uploader-module-ch340/?srsltid=AfmBOoqNxy17lGU1ezZVjLcL5Xx1m69ub7XCWEg4E_d-pxh13XS1gMx9

### Community Threads
- **Reddit: Connecting Raspberry Pi to STM32 (UART basics helpful for debugging)**: https://www.reddit.com/r/stm32/comments/1iewevp/how_to_connect_a_rasberry_pi_to_a_stm32_board/

### General Research
- **Google search: “Raspberry Pi 5 with SIM LTE module”**: https://www.google.com/search?q=Raspberry+Pi+5+with+SIMLTE+modeule&oq=Raspberry+Pi+5+with+SIMLTE+modeule&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQIRgKGKABMgkIAhAhGAoYoAEyBwgDECEYjwIyBwgEECEYjwLSAQkxMTQ5OWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8
