# Game Engine Design Patterns Assignment

## 🎯 Learning Objectives

This assignment will help you master essential design patterns and Low-Level Design (LLD) principles by implementing a simple turn-based game engine. You'll learn to:

- **Observer Pattern**: Implement event-driven communication between game components
- **Strategy Pattern**: Create flexible character movement and action systems
- **Singleton Pattern**: Ensure single instance management for game state
- **Object-Oriented Design**: Apply SOLID principles and proper encapsulation

## 📋 Assignment Overview

You need to implement a turn-based combat system where characters can perform different types of moves based on their strategy. The game should notify observers about important events and maintain a single game manager instance.

## 🏗️ Project Structure

```
src/main/java/com/game/engine/
├── entity/
│   └── Character.java          # Main character class
├── observer/
│   ├── GameObserver.java       # Observer interface
│   ├── GameDisplay.java        # Display observer implementation
│   └── GameLogger.java         # Logger observer implementation
├── singleton/
│   └── GameManager.java        # Singleton game manager
├── strategy/
│   ├── MoveStrategy.java       # Strategy interface
│   ├── AggressiveStrategy.java # Aggressive move implementation
│   ├── DefensiveStrategy.java  # Defensive move implementation
│   └── RandomStrategy.java     # Random move implementation
└── App.java                    # Main application entry point
```

## 🎮 Game Rules

### Character System
- Each character has: **name**, **health**, **attack power**, and a **move strategy**
- Characters can perform moves that affect their own or other characters' health
- Health cannot go below 0 or above 100

### Move Strategies
- **Aggressive Strategy**: Attack another character (deal damage equal to attack power)
- **Defensive Strategy**: Heal self (+5 health)
- **Random Strategy**: Randomly choose between attack or heal

### Game Manager (Singleton)
- Maintains a single instance throughout the application
- Manages observers and notifies them of game events
- Handles turn-based gameplay between two characters

### Observer System
- **GameDisplay**: Stores and displays game events
- **GameLogger**: Logs game events (you can implement simple console logging)
- Both observers should receive notifications when game events occur

## 🧪 Testing Requirements

Your implementation must pass all provided test cases. The tests validate:

1. **Singleton Pattern**: GameManager returns the same instance
2. **Strategy Pattern**: Different strategies produce expected behaviors
3. **Observer Pattern**: Observers receive and store game events
4. **Game Logic**: Turn-based combat works correctly

## 📝 Implementation Guidelines

### DO:
- Follow the existing package structure
- Implement all interfaces and abstract classes
- Ensure proper encapsulation and data hiding
- Use meaningful variable and method names
- Add appropriate comments for complex logic

### DON'T:
- Modify the test files
- Change the package structure
- Add unnecessary dependencies
- Implement features not required by the tests

## 🚀 Getting Started

1. **Fork/Clone** this repository
2. **Run tests** to see current failures: `mvn test`
3. **Implement** the required classes one by one
4. **Test frequently** to ensure your implementation works
5. **Submit** your working solution

## 🔧 Running the Project

```bash
# Compile the project
mvn clean compile

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=GameEngineTest

# Run the main application
mvn exec:java -Dexec.mainClass="com.game.engine.App"
```

## 📊 Grading Criteria

- **Functionality (60%)**: All tests pass
- **Code Quality (25%)**: Clean, readable, well-structured code
- **Design Patterns (15%)**: Proper implementation of Observer, Strategy, and Singleton patterns

## 💡 Hints

- Start with the **Character class** - it's the foundation
- Implement **Strategy pattern** first - it's the most straightforward
- **Observer pattern** requires careful event handling
- **Singleton** should be thread-safe and lazy-loaded
- Use the test cases as your specification - they tell you exactly what behavior is expected

## 🎓 Bonus Challenges

After completing the basic requirements, try these advanced features:

1. Add a **Factory Pattern** for creating different character types
2. Implement **Command Pattern** for undo/redo functionality
3. Add **State Pattern** for character status effects
4. Create a **Builder Pattern** for complex character creation

---

**Good luck! Remember: The tests are your friends - they'll guide you to the correct implementation.**
