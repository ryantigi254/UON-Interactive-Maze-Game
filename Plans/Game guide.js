////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //Added Features
// With the help of Chat GPT for Ideation (https://chat.openai.com/)
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // // Levelling System.
// Based on the provided leveling structure and the suggested enhancements for the A* pathfinding algorithm, here's an updated comprehensive and concise leveling structure:

// Level 1-5:
// - Introduce basic gameplay mechanics and maze layouts
// - Gradually increase the number of enemies and maze complexity
// - Implement point collection and power-ups (e.g., invincibility, speed boost)
// - Introduce different enemy types with unique behaviors

// Level 6-10:
// - Introduce more challenging maze layouts with dead ends and narrow passages
// - Add teleportation portals and moving obstacles
// - Increase the speed of enemies and introduce time-limited levels
// - Implement dynamic obstacle avoidance for enemies
// - Introduce enemy chasing behavior and boss enemies with unique abilities

// Level 11-15:
// - Significantly increase the complexity of maze layouts
// - Introduce advanced enemy types with collaborative behavior and adaptive difficulty
// - Incorporate challenging obstacles, traps, and puzzles
// - Implement dynamic maze generation for unique level experiences
// - Enhance the A* algorithm with advanced heuristics and asynchronous pathfinding

// Level 16-20:
// - Create highly complex and large maze layouts
// - Introduce multiple boss enemies with complex patterns and abilities
// - Combine various mechanics introduced in previous levels
// - Optimize the A* algorithm for efficient pathfinding in large mazes
// - Implement a hybrid approach combining A* with other pathfinding algorithms
// - Enhance visual and audio effects to create an immersive experience

// Additional features:
// 1. Power-ups:
//    - Temporary invincibility
//    - Ability to pass through walls
//    - Enemy freezing

// 2. Scoring system:
//    - High score leaderboard
//    - Bonus points for completing levels quickly
//    - Combo system for collecting multiple points in succession

// 3. Lives and checkpoints:
//    - Lives system with extra lives as rewards
//    - Checkpoints within levels

// 4. Visual enhancements:
//    - Animations for character movements and interactions
//    - Dynamic lighting effects
//    - Particle effects for collectibles and power-ups

// 5. Sound and music:
//    - Sound effects for character actions and events
//    - Background music that changes based on the level or situation

// Remember to gradually introduce new mechanics and increase the difficulty as the player progresses through the levels. Regularly playtest and iterate on the level designs to ensure a balanced and enjoyable gaming experience.

// By following this updated leveling structure and incorporating the suggested enhancements to the A* algorithm, you can create a challenging and engaging game that showcases advanced JavaScript techniques and pathfinding algorithms.

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Leveling Structure
// Ideation was mine however implementation logic below was thanks to LLMA 3 (https://groq.com/)
// Your code is structured around a single level, with the game logic, player movement, and collision detection all tied to this single level. To implement a next level feature, you'll need to refactor your code to support multiple levels.

// Refactoring Suggestions

// Level Data Structure: Create a data structure to store level data, such as the maze layout, enemy positions, and point locations. This will allow you to easily switch between levels.
// Level Manager: Create a level manager class or function that handles level transitions, including:
// Loading the next level data
// Updating the game state (e.g., player position, score)
// Resetting the game state (e.g., player lives, score)
// Game Loop Refactoring: Refactor your game loop to use the level manager and level data structure. This will allow you to easily switch between levels.
// Next Level Feature Implementation

// To implement the next level feature, you can follow these steps:

// Level Completion Detection: Detect when the player has completed the current level (e.g., by collecting all points or reaching a specific location).
// Level Transition: When the level is completed, use the level manager to load the next level data and update the game state.
// Reset Game State: Reset the game state, including the player's position, score, and lives.
// Update UI: Update the UI to reflect the new level, including the maze layout, enemy positions, and point locations.
// Task List

// To implement the next level feature, you can follow this task list:

// Create a level data structure to store level data.
// Implement a level manager class or function to handle level transitions.
// Refactor the game loop to use the level manager and level data structure.
// Implement level completion detection.
// Implement level transition logic.
// Reset game state when transitioning to a new level.
// Update the UI to reflect the new level. 
