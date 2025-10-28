package com.game.engine;

import com.game.engine.entity.Character;
import com.game.engine.singleton.GameManager;
import com.game.engine.strategy.AggressiveStrategy;
import com.game.engine.strategy.DefensiveStrategy;
import com.game.engine.observer.GameDisplay;
import com.game.engine.observer.GameLogger;

/**
 * Main application entry point for the Game Engine.
 * 
 * This class demonstrates how to use the implemented design patterns.
 * Students can run this to see their implementation in action.
 */
public class App {
    public static void main(String[] args) {
        System.out.println("🎮 Game Engine Design Patterns Demo");
        System.out.println("=====================================");
        
        // TODO: Students should implement the classes first, then this will work
        try {
            // Create game manager (Singleton)
            GameManager gameManager = GameManager.getInstance();
            
            // Add observers
            GameDisplay display = new GameDisplay();
            GameLogger logger = new GameLogger();
            gameManager.addObserver(display);
            gameManager.addObserver(logger);
            
            // Create characters with different strategies
            Character hero = new Character("Hero", 100, 20, new AggressiveStrategy());
            Character enemy = new Character("Goblin", 80, 15, new DefensiveStrategy());
            
            // Play a turn
            System.out.println("\n🏹 Playing a turn...");
            gameManager.playTurn(hero, enemy);
            
            // Display results
            System.out.println("\n📊 Game Events:");
            for (String event : display.getEvents()) {
                System.out.println("  - " + event);
            }
            
            System.out.println("\n✅ Demo completed successfully!");
            
        } catch (Exception e) {
            System.out.println("❌ Implementation not complete yet. Please implement all required classes.");
            System.out.println("Error: " + e.getMessage());
        }
    }
}
