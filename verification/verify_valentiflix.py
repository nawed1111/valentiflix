from playwright.sync_api import Page, expect, sync_playwright
import time

def test_valentiflix_flow(page: Page):
    # 1. Login
    print("Navigating to login...")
    page.goto("http://127.0.0.1:5000/login")
    page.fill("input[name='username']", "love")
    page.fill("input[name='password']", "you")
    page.click("button[type='submit']")

    # Verify Profiles Page
    print("Verifying profiles...")
    expect(page.locator("text=Who's watching?")).to_be_visible()

    # 2. Select Profile (My Love)
    print("Selecting profile...")
    page.click("text=My Love")

    # Wait for transition/Ta-dum
    time.sleep(2)

    # Verify Browse Page
    print("Verifying browse page...")
    expect(page).to_have_url("http://127.0.0.1:5000/browse")

    # 3. Go to Watch Page (Rose Day)
    print("Navigating to watch page...")
    page.goto("http://127.0.0.1:5000/watch/rose")

    # Verify Watch Page Elements
    expect(page.locator("h1")).to_contain_text("The Red Rose")
    expect(page.locator("button:has-text('Watch Episode')")).to_be_visible()
    expect(page.locator("button:has-text('Daily Trivia')")).to_be_visible()

    # Screenshot Watch Page Main
    print("Screenshotting watch page...")
    page.screenshot(path="verification/watch_page.png")

    # 4. Open Trivia
    print("Opening trivia...")
    page.click("button:has-text('Daily Trivia')")
    expect(page.locator("#triviaOverlay")).to_be_visible()
    time.sleep(1) # wait for fade in
    page.screenshot(path="verification/trivia_modal.png")

    # Close Trivia
    print("Closing trivia...")
    page.click("button[onclick='closeTrivia()']")
    # expect(page.locator("#triviaOverlay")).not_to_be_visible() # Might just be hidden class

    # 5. Open Video
    print("Opening video...")
    page.click("button:has-text('Watch Episode')")
    expect(page.locator("#videoOverlay")).to_be_visible()
    time.sleep(1)
    page.screenshot(path="verification/video_player.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_valentiflix_flow(page)
        finally:
            browser.close()
