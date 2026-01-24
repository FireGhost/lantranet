import { test, expect } from '@playwright/test';
import { getAdminPage, getUserPage, setupBasicSettings } from "./utils/usersUtils";

test('admin can CRUD animations', async ({ browser }) => {
  const adminPage = await getAdminPage(browser);
  const userPage = await getUserPage(browser);

  await setupBasicSettings(browser);

  await adminPage.pause();
  await userPage.pause();
});

/**
 * Features to test:
 * - Admin can CRUD animations.
 * - User can register to a player based animation
 * - User can register to a team based animation
 * - Admin can register a user to a player based animation
 * - Admin can register a team to a team based animation
 * - Admin can give score to a user
 * - Admin can give score to a team
 * - User can access the score page and the score calculation is correct
 * 
 * CRUD animation
 * - As a user, the button to create an animation should not be available
 * - As a user, I can't access the animation creation page
 * - As admin, create a new animation
 * 
 * - As a user, I can access the animation page
 * - As a user, the animation is availble in the menu on the side
 * 
 * - As a user, I can't access the animation edition page
 * - As admin, update an animation
 * 
 * - As a user, I can't delete the animation edition page
 * - As admin, delete an animation
 * - As a user, the animation is not avail
 * 
 * Player based registration
 * - As admin, create a new animation based on players
 * - As a user, try to register to the animation. It should be closed.
 * - As admin, open the registration.
 * - As a user, register to the animation. It should be opened and the user shoud appear in the registered list.
 * - As a user, remove my registration. It should be opened and the user should not appear in the registered list.
 * - As an admin, close the registration
 */
