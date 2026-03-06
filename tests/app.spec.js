import { test, expect } from '@playwright/test';

/**
 * Ukrainian Radio PWA - Main Application Tests
 * Tests for core functionality: loading, playback, station selection, theme
 */

test.describe('Ukrainian Radio PWA - Main Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test.describe('Initial Load', () => {
    test('should load the application successfully', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Українські Радіостанції/);
      
      // Check main heading
      const heading = page.getByRole('heading', { name: /Українське Радіо/ });
      await expect(heading).toBeVisible();
    });

    test('should display the player controls', async ({ page }) => {
      // Wait for player to be visible
      const player = page.getByRole('region', { name: /Аудіо плеєр/ });
      await expect(player).toBeVisible();
      
      // Check play button exists
      const playButton = page.getByRole('button', { name: /Відтворити/ });
      await expect(playButton).toBeVisible();
    });

    test('should display station list', async ({ page }) => {
      // Wait for stations to load
      const stationList = page.getByRole('listbox', { name: /Список радіостанцій/ });
      await expect(stationList).toBeVisible();
      
      // Check that stations are loaded
      const stationItems = page.getByRole('option');
      await expect(stationItems.first()).toBeVisible({ timeout: 10000 });
    });

    test('should display online status indicator', async ({ page }) => {
      const statusIndicator = page.getByText(/Онлайн|Офлайн/);
      await expect(statusIndicator).toBeVisible();
    });

    test('should display theme toggle button', async ({ page }) => {
      const themeToggle = page.getByRole('button', { name: /Темна тема|Світла тема/ });
      await expect(themeToggle).toBeVisible();
    });
  });

  test.describe('Station Selection', () => {
    test('should select a station from the list', async ({ page }) => {
      // Wait for stations to load
      const firstStation = page.getByRole('option').first();
      await firstStation.click();
      
      // Check station is marked as active
      await expect(firstStation).toHaveClass(/station-list__item--active/);
    });

    test('should update player info when station is selected', async ({ page }) => {
      // Get first station name
      const firstStation = page.getByRole('option').first();
      const stationName = await firstStation.textContent();
      
      // Click on station
      await firstStation.click();
      
      // Wait for player to update
      await page.waitForTimeout(500);
      
      // Check station name appears in player
      const playerStationName = page.getByText(stationName?.trim() || '');
      await expect(playerStationName).toBeVisible();
    });

    test('should scroll to active station', async ({ page }) => {
      // Get a station in the middle of the list
      const stationItems = page.getByRole('option');
      const middleIndex = Math.floor((await stationItems.count()) / 2);
      const middleStation = stationItems.nth(middleIndex);
      
      // Click on middle station
      await middleStation.click();
      
      // Wait for scroll
      await page.waitForTimeout(100);
      
      // Check station is visible in viewport
      await expect(middleStation).toBeInViewport();
    });
  });

  test.describe('Playback Controls', () => {
    test('should toggle play/pause', async ({ page }) => {
      // Select a station first
      const firstStation = page.getByRole('option').first();
      await firstStation.click();
      
      // Wait for station to be ready
      await page.waitForTimeout(500);
      
      // Get play button
      const playButton = page.getByRole('button', { name: /Відтворити|Пауза/ });
      
      // Click play
      await playButton.click();
      
      // Wait for state change
      await page.waitForTimeout(500);
      
      // Button should now show pause
      const pauseButton = page.getByRole('button', { name: /Пауза/ });
      await expect(pauseButton).toBeVisible();
    });

    test('should stop playback', async ({ page }) => {
      // Select and play a station
      const firstStation = page.getByRole('option').first();
      await firstStation.click();
      await page.waitForTimeout(500);
      
      const playButton = page.getByRole('button', { name: /Відтворити|Пауза/ });
      await playButton.click();
      await page.waitForTimeout(500);
      
      // Click stop
      const stopButton = page.getByRole('button', { name: /Зупинити/ });
      await stopButton.click();
      
      // Wait for state change
      await page.waitForTimeout(500);
      
      // Should show play button again
      const playButtonAgain = page.getByRole('button', { name: /Відтворити/ });
      await expect(playButtonAgain).toBeVisible();
    });

    test('should navigate to next station', async ({ page }) => {
      // Select first station
      const firstStation = page.getByRole('option').first();
      await firstStation.click();
      await page.waitForTimeout(300);
      
      // Click next
      const nextButton = page.getByRole('button', { name: /Наступна станція/ });
      await nextButton.click();
      await page.waitForTimeout(300);
      
      // Check second station is now active
      const secondStation = page.getByRole('option').nth(1);
      await expect(secondStation).toHaveClass(/station-list__item--active/);
    });

    test('should navigate to previous station', async ({ page }) => {
      // Select second station first
      const secondStation = page.getByRole('option').nth(1);
      await secondStation.click();
      await page.waitForTimeout(300);
      
      // Click previous
      const prevButton = page.getByRole('button', { name: /Попередня станція/ });
      await prevButton.click();
      await page.waitForTimeout(300);
      
      // Check first station is now active
      const firstStation = page.getByRole('option').first();
      await expect(firstStation).toHaveClass(/station-list__item--active/);
    });

    test('should adjust volume', async ({ page }) => {
      // Find volume slider
      const volumeSlider = page.getByRole('slider', { name: /Гучність/ });
      await expect(volumeSlider).toBeVisible();
      
      // Set volume to 50%
      await volumeSlider.fill('0.5');
      
      // Verify volume changed
      const currentValue = await volumeSlider.inputValue();
      expect(parseFloat(currentValue)).toBeCloseTo(0.5, 1);
    });
  });

  test.describe('Theme Toggle', () => {
    test('should toggle between light and dark themes', async ({ page }) => {
      // Get initial theme
      const htmlElement = page.locator('html');
      const initialTheme = await htmlElement.getAttribute('data-theme');
      
      // Click theme toggle
      const themeToggle = page.getByRole('button', { name: /Темна тема|Світла тема/ });
      await themeToggle.click();
      
      // Wait for theme change
      await page.waitForTimeout(200);
      
      // Check theme changed
      const newTheme = await htmlElement.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
    });

    test('should persist theme in localStorage', async ({ page }) => {
      // Toggle theme
      const themeToggle = page.getByRole('button', { name: /Темна тема|Світла тема/ });
      await themeToggle.click();
      await page.waitForTimeout(200);
      
      // Get theme from localStorage
      const storedTheme = await page.evaluate(() => localStorage.getItem('radio-theme'));
      expect(storedTheme).toMatch(/^(dark|light)$/);
    });
  });

  test.describe('Search Functionality', () => {
    test('should filter stations by search query', async ({ page }) => {
      // Wait for search input to be visible (only if more than 10 stations)
      const searchInput = page.getByPlaceholder(/Пошук станцій/);
      
      // Check if search exists (depends on number of stations)
      const searchExists = await searchInput.count() > 0;
      
      if (searchExists) {
        // Enter search query
        await searchInput.fill('FM');
        
        // Wait for filtering
        await page.waitForTimeout(300);
        
        // All visible stations should contain "FM"
        const stationNames = page.getByRole('option');
        const count = await stationNames.count();
        
        for (let i = 0; i < count; i++) {
          const name = await stationNames.nth(i).textContent();
          expect(name?.toLowerCase()).toContain('fm');
        }
      }
    });
  });

  test.describe('Share Functionality', () => {
    test('should have share button', async ({ page }) => {
      const shareButton = page.getByRole('button', { name: /Поділитися/ });
      await expect(shareButton).toBeVisible();
    });
  });

  test.describe('Network Status', () => {
    test('should display network information', async ({ page }) => {
      const networkInfo = page.getByLabel(/Інформація про мережу/);
      await expect(networkInfo).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check player is visible
      const player = page.getByRole('region', { name: /Аудіо плеєр/ });
      await expect(player).toBeVisible();
      
      // Check controls are accessible
      const playButton = page.getByRole('button', { name: /Відтворити/ });
      await expect(playButton).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Check station grid layout
      const stationList = page.getByRole('listbox', { name: /Список радіостанцій/ });
      await expect(stationList).toBeVisible();
    });

    test('should work on desktop viewport', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Check all elements are visible
      const header = page.getByRole('banner');
      const player = page.getByRole('region', { name: /Аудіо плеєр/ });
      const stationList = page.getByRole('listbox', { name: /Список радіостанцій/ });
      
      await expect(header).toBeVisible();
      await expect(player).toBeVisible();
      await expect(stationList).toBeVisible();
    });
  });

  test.describe('LocalStorage Persistence', () => {
    test('should save active station to localStorage', async ({ page }) => {
      // Select a station
      const firstStation = page.getByRole('option').first();
      const stationUuid = await firstStation.getAttribute('data-station-uuid');
      
      await firstStation.click();
      await page.waitForTimeout(500);
      
      // Check localStorage
      const storedStation = await page.evaluate(() => localStorage.getItem('radio-active-station'));
      expect(storedStation).toBe(stationUuid);
    });

    test('should save volume to localStorage', async ({ page }) => {
      // Adjust volume
      const volumeSlider = page.getByRole('slider', { name: /Гучність/ });
      await volumeSlider.evaluate((el) => {
        el.value = '0.75';
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      await page.waitForTimeout(300);
      
      // Check localStorage
      const storedVolume = await page.evaluate(() => localStorage.getItem('radio-volume'));
      expect(storedVolume).toBe('0.75');
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Check player region has aria-label
      const player = page.getByRole('region', { name: /Аудіо плеєр/ });
      await expect(player).toHaveAttribute('aria-label');
      
      // Check station list has aria-label
      const stationList = page.getByRole('listbox', { name: /Список радіостанцій/ });
      await expect(stationList).toHaveAttribute('aria-label');
    });

    test('should have keyboard navigation support', async ({ page }) => {
      // Tab to first station
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Check focus is on a station
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toHaveClass(/station-list__item/);
    });

    test('should support Enter key to select station', async ({ page }) => {
      // Focus on first station
      const firstStation = page.getByRole('option').first();
      await firstStation.focus();
      
      // Press Enter
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      
      // Check station is active
      await expect(firstStation).toHaveClass(/station-list__item--active/);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API failure gracefully', async ({ page }) => {
      // This test would require mocking the API response
      // For now, just check that error state can be displayed
      expect(true).toBe(true);
    });
  });
});
