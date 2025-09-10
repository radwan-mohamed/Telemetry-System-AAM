/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2025 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */
/* USER CODE END Header */
/* Includes ------------------------------------------------------------------*/
#include "main.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */

/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */
//mmmmmmmmmmmmmmmmmmmmm
#define UART_BUF_SIZE 128
/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */

/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
UART_HandleTypeDef huart4;
UART_HandleTypeDef huart5;

/* USER CODE BEGIN PV */
//mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
/*
volatile uint32_t adcValue = 0;
volatile float voltage = 0.0;
volatile float temperature = 0.0;
char uartBuffer[UART_BUF_SIZE];
*/
/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_UART4_Init(void);
static void MX_UART5_Init(void);
/* USER CODE BEGIN PFP */
/*
void Read_ECT_Sensor(void);
void Print_Sensor_Data(void);
void sendTempToNextion(float temp);
*/


void sendRPMToNextion(uint16_t rpm) {
    char buffer[64];

    // Send value to slider (h0)
    int len2 = snprintf(buffer, sizeof(buffer), "h0.val=%d\xFF\xFF\xFF", rpm);
    HAL_UART_Transmit(&huart4, (uint8_t*)buffer, len2, HAL_MAX_DELAY);

  //  HAL_Delay(5);  // Small delay to avoid data collision


    // Send the same value to number component (n1)
   int len3 = snprintf(buffer, sizeof(buffer), "n1.val=%d\xFF\xFF\xFF", rpm);
   HAL_UART_Transmit(&huart4, (uint8_t*)buffer, len3, HAL_MAX_DELAY);
}



void sendSpeedToNextion(uint16_t speed) {
    char buffer[64];

    // Send the same value to number component (n1)
   int len4 = snprintf(buffer, sizeof(buffer), "n0.val=%d\xFF\xFF\xFF", speed);
   HAL_UART_Transmit(&huart4, (uint8_t*)buffer, len4, HAL_MAX_DELAY);
}




void sendGearToNextion(uint16_t gear) {
    char buffer[64];

    // Send the same value to number component (n1)
   int len5 = snprintf(buffer, sizeof(buffer), "n2.val=%d\xFF\xFF\xFF", gear);
   HAL_UART_Transmit(&huart4, (uint8_t*)buffer, len5, HAL_MAX_DELAY);
}



void sendTempToNextion(uint16_t temp) {
    char buffer[64];

    // Send the same value to number component (n1)
   int len6 = snprintf(buffer, sizeof(buffer), "n3.val=%d\xFF\xFF\xFF", temp);
   HAL_UART_Transmit(&huart4, (uint8_t*)buffer, len6, HAL_MAX_DELAY);
}



void sendfuelToNextion(uint16_t fuel) {
    char buffer1[32];
    int len1 = snprintf(buffer1, sizeof(buffer1), "h1.val=%d\xFF\xFF\xFF", fuel);
    HAL_UART_Transmit(&huart4, (uint8_t*)buffer1, len1, HAL_MAX_DELAY);
}




// new functions for he telemtry system



void sendRPMToTelemetry_UART5(uint16_t rpm) {
    char buffer[32];

    int len2 = snprintf(buffer, sizeof(buffer), "rpm=%d\n", rpm);
    HAL_UART_Transmit(&huart5, (uint8_t*)buffer, len2, HAL_MAX_DELAY);

}


void sendSpeedToTelemetry_UART5(uint16_t speed) {
    char buffer[32];

    int len4 = snprintf(buffer, sizeof(buffer), "speed=%d\n", speed);
    HAL_UART_Transmit(&huart5, (uint8_t*)buffer, len4, HAL_MAX_DELAY);
}




void sendGearToTelemetry_UART5(uint16_t gear) {
    char buffer[32];

    int len5 = snprintf(buffer, sizeof(buffer), "gear=%d\n", gear);
    HAL_UART_Transmit(&huart5, (uint8_t*)buffer, len5, HAL_MAX_DELAY);
}



void sendTempToTelemetry_UART5(uint16_t temp) {
    char buffer[32];

    int len6 = snprintf(buffer, sizeof(buffer), "temp=%d\n", temp);
    HAL_UART_Transmit(&huart5, (uint8_t*)buffer, len6, HAL_MAX_DELAY);
}


void sendfuelToTelemetry_UART5(uint16_t fuel) {
    char buffer1[32];

    int len1 = snprintf(buffer1, sizeof(buffer1), "fuel=%d\n", fuel);
    HAL_UART_Transmit(&huart5, (uint8_t*)buffer1, len1, HAL_MAX_DELAY);
}



//function l warning battery
// Show picture (assuming ID 2 is your battery icon)
void show_picture_battery() {
  char cmd[] = "p0.pic=2\xFF\xFF\xFF";
  HAL_UART_Transmit(&huart4, (uint8_t*)cmd, strlen(cmd), HAL_MAX_DELAY);
}

// Hide picture (assuming ID 0 is blank)
void hide_picture_battery() {
  char cmd[] = "p0.pic=3\xFF\xFF\xFF";
  HAL_UART_Transmit(&huart4, (uint8_t*)cmd, strlen(cmd), HAL_MAX_DELAY);
}



//function l warning fuel
void show_picture_fuel() {
  char cmd1[] = "p1.pic=4\xFF\xFF\xFF";
  HAL_UART_Transmit(&huart4, (uint8_t*)cmd1, strlen(cmd1), HAL_MAX_DELAY);
}

// Hide picture (assuming ID 0 is blank)
void hide_picture_fuel() {
  char cmd1[] = "p1.pic=5\xFF\xFF\xFF";
  HAL_UART_Transmit(&huart4, (uint8_t*)cmd1, strlen(cmd1), HAL_MAX_DELAY);
}



//function l warning Temperature
// Show picture (assuming ID 2 is your battery icon)
void show_picture_Temp() {
  char cmd2[] = "p2.pic=6\xFF\xFF\xFF";
  HAL_UART_Transmit(&huart4, (uint8_t*)cmd2, strlen(cmd2), HAL_MAX_DELAY);
}

// Hide picture (assuming ID 0 is blank)
void hide_picture_Temp() {
  char cmd2[] = "p2.pic=7\xFF\xFF\xFF";
  HAL_UART_Transmit(&huart4, (uint8_t*)cmd2, strlen(cmd2), HAL_MAX_DELAY);
}



//function l N gear
// Show picture (assuming ID 2 is your battery icon)
void show_picture_N() {
  char cmd3[] = "p3.pic=8\xFF\xFF\xFF";
  HAL_UART_Transmit(&huart4, (uint8_t*)cmd3, strlen(cmd3), HAL_MAX_DELAY);
}

// Hide picture (assuming ID 0 is blank)
void hide_picture_N()
{
  char cmd3[] = "p3.pic=9\xFF\xFF\xFF";
  HAL_UART_Transmit(&huart4, (uint8_t*)cmd3, strlen(cmd3), HAL_MAX_DELAY);
}



/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */

/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{

  /* USER CODE BEGIN 1 */

  /* USER CODE END 1 */

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */

  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_UART4_Init();
  MX_UART5_Init();
  /* USER CODE BEGIN 2 */


  /*HAL_Init();*/           /*anaaaaaa*/
  /*SystemClock_Config();*/

  uint16_t current_rpm = 0;

  uint16_t current_fuel= 0;

  //uint16_t current_battery= 0;

  uint16_t current_speed= 0;


  uint16_t current_gear= 0;


  uint16_t current_temp= 0;

  /* deh ll battery icon function
  int user_input = 20; // Your input value
  updateBatteryButton(user_input);
  */



  /* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1)
  {
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
    /* USER CODE BEGIN 3 */
	  current_speed++;
	  if (current_speed > 100) current_speed = 0;

	  	   // Send to Nextion

	      sendSpeedToNextion(current_speed);
	      sendSpeedToTelemetry_UART5(current_speed);



	  	  HAL_Delay(150);  // Update every 100ms
	      /* USER CODE BEGIN 3 */
	  current_fuel += 2;
	  if (current_fuel>110) current_fuel =0;
	  	sendfuelToNextion(current_fuel);
	  	sendfuelToTelemetry_UART5(current_fuel);

	  	HAL_Delay(150);



/*
	  	if (current_gear > 6)current_gear = 0;

	  		  	   // Send to Nextion
	  	sendGearToNextion(current_gear);

	  	HAL_Delay(150);  // Update every 100ms
	  		      /* USER CODE BEGIN 3 */

	  	current_gear++;
		if (current_gear > 6) current_gear = 0;

		// Show or hide "N" icon based on gear
		if (current_gear == 0)
		{
		    show_picture_N();  // Show Neutral "N"
		}
		else
		{
		    hide_picture_N();  // Hide Neutral "N"
		}

		// Send to Nextion
		sendGearToNextion(current_gear);
		sendGearToTelemetry_UART5(current_gear);
		HAL_Delay(150);




		current_temp += 5;
	  	if (current_temp > 150) current_temp = 0;

	    // Send to Nextion
	   sendTempToNextion(current_temp);
	   sendTempToTelemetry_UART5(current_temp);
	  	HAL_Delay(150);  // Update every 100ms
	  		  		      /* USER CODE BEGIN 3 */

/*
		Read_ECT_Sensor();
	    Print_Sensor_Data();
		sendTempToNextion(temperature);
		HAL_Delay(1000);
*/



  }





  /* USER CODE END 3 */
}

/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  /** Configure the main internal regulator output voltage
  */
  __HAL_RCC_PWR_CLK_ENABLE();
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE1);

  /** Initializes the RCC Oscillators according to the specified parameters
  * in the RCC_OscInitTypeDef structure.
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.HSICalibrationValue = RCC_HSICALIBRATION_DEFAULT;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL.PLLM = 8;
  RCC_OscInitStruct.PLL.PLLN = 180;
  RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV2;
  RCC_OscInitStruct.PLL.PLLQ = 2;
  RCC_OscInitStruct.PLL.PLLR = 2;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }

  /** Activate the Over-Drive mode
  */
  if (HAL_PWREx_EnableOverDrive() != HAL_OK)
  {
    Error_Handler();
  }

  /** Initializes the CPU, AHB and APB buses clocks
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV4;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV2;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_5) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief UART4 Initialization Function
  * @param None
  * @retval None
  */
static void MX_UART4_Init(void)
{

  /* USER CODE BEGIN UART4_Init 0 */

  /* USER CODE END UART4_Init 0 */

  /* USER CODE BEGIN UART4_Init 1 */

  /* USER CODE END UART4_Init 1 */
  huart4.Instance = UART4;
  huart4.Init.BaudRate = 9600;
  huart4.Init.WordLength = UART_WORDLENGTH_8B;
  huart4.Init.StopBits = UART_STOPBITS_1;
  huart4.Init.Parity = UART_PARITY_NONE;
  huart4.Init.Mode = UART_MODE_TX_RX;
  huart4.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart4.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart4) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN UART4_Init 2 */

  /* USER CODE END UART4_Init 2 */

}




/**
  * @brief UART5 Initialization Function
  * @param None
  * @retval None
  */
static void MX_UART5_Init(void)
{

  /* USER CODE BEGIN UART5_Init 0 */

  /* USER CODE END UART5_Init 0 */

  /* USER CODE BEGIN UART5_Init 1 */

  /* USER CODE END UART5_Init 1 */
  huart5.Instance = UART5;
  huart5.Init.BaudRate = 115200;
  huart5.Init.WordLength = UART_WORDLENGTH_8B;
  huart5.Init.StopBits = UART_STOPBITS_1;
  huart5.Init.Parity = UART_PARITY_NONE;
  huart5.Init.Mode = UART_MODE_TX_RX;
  huart5.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart5.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart5) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN UART5_Init 2 */

  /* USER CODE END UART5_Init 2 */

}

/**
  * @brief GPIO Initialization Function
  * @param None
  * @retval None
  */
static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  /* USER CODE BEGIN MX_GPIO_Init_1 */

  /* USER CODE END MX_GPIO_Init_1 */

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOC_CLK_ENABLE();
  __HAL_RCC_GPIOH_CLK_ENABLE();
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOD_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(LD2_GPIO_Port, LD2_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pin : B1_Pin */
  GPIO_InitStruct.Pin = B1_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  HAL_GPIO_Init(B1_GPIO_Port, &GPIO_InitStruct);

  /*Configure GPIO pins : USART_TX_Pin USART_RX_Pin */
  GPIO_InitStruct.Pin = USART_TX_Pin|USART_RX_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
  GPIO_InitStruct.Alternate = GPIO_AF7_USART2;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

  /*Configure GPIO pin : LD2_Pin */
  GPIO_InitStruct.Pin = LD2_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(LD2_GPIO_Port, &GPIO_InitStruct);

  /* USER CODE BEGIN MX_GPIO_Init_2 */

  /* USER CODE END MX_GPIO_Init_2 */
}

/* USER CODE BEGIN 4 */

/* USER CODE END 4 */

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */
  __disable_irq();
  while (1)
  {
  }
  /* USER CODE END Error_Handler_Debug */
}
#ifdef USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(uint8_t *file, uint32_t line)
{
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     ex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */
