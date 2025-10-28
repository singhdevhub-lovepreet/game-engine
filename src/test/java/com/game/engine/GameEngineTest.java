package com.game.engine;

import com.game.engine.entity.Character;
import com.game.engine.singleton.GameManager;
import com.game.engine.strategy.*;
import com.game.engine.observer.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive test suite for Game Engine Design Patterns Assignment.
 * 
 * These tests validate the correct implementation of:
 * - Singleton Pattern (GameManager)
 * - Strategy Pattern (MoveStrategy implementations)
 * - Observer Pattern (GameObserver implementations)
 * - Game logic and character interactions
 */
public class GameEngineTest {

    @BeforeEach
    void setUp() {
        // Clear observers before each test to ensure clean state
        GameManager.getInstance().clearObservers();
    }

    @Test
    @DisplayName("Singleton Pattern: GameManager should return same instance")
    public void testSingletonIntegrity() {
        GameManager gm1 = GameManager.getInstance();
        GameManager gm2 = GameManager.getInstance();
        assertSame(gm1, gm2, "GameManager should be singleton - same instance should be returned");
    }

    @Test
    @DisplayName("Strategy Pattern: AggressiveStrategy should attack target")
    public void testAggressiveStrategyAttack() {
        Character attacker = new Character("Hero", 100, 20, new AggressiveStrategy());
        Character enemy = new Character("Goblin", 100, 10, new DefensiveStrategy());
        
        attacker.performMove(enemy);
        
        assertEquals(80, enemy.getHealth(), "Enemy should lose 20 HP after aggressive attack");
        assertEquals(100, attacker.getHealth(), "Attacker health should remain unchanged");
    }

    @Test
    @DisplayName("Strategy Pattern: DefensiveStrategy should heal self")
    public void testDefensiveStrategyHeal() {
        Character defender = new Character("Cleric", 90, 10, new DefensiveStrategy());
        
        defender.performMove(null); // Target can be null for defensive strategy
        
        assertEquals(95, defender.getHealth(), "Defensive strategy should heal by +5 HP");
    }

    @Test
    @DisplayName("Strategy Pattern: RandomStrategy should perform random action")
    public void testRandomStrategyBehavior() {
        Character randomChar = new Character("Mage", 50, 15, new RandomStrategy());
        Character target = new Character("Enemy", 100, 10, new DefensiveStrategy());
        
        int initialHealth = randomChar.getHealth();
        int targetInitialHealth = target.getHealth();
        
        randomChar.performMove(target);
        
        // Random strategy should either heal self or attack target
        boolean selfHealed = randomChar.getHealth() > initialHealth;
        boolean targetAttacked = target.getHealth() < targetInitialHealth;
        
        assertTrue(selfHealed || targetAttacked, 
            "Random strategy should either heal self or attack target");
    }

    @Test
    @DisplayName("Observer Pattern: GameDisplay should store received events")
    public void testObserverReceivesEvent() {
        GameManager gm = GameManager.getInstance();
        GameDisplay display = new GameDisplay();
        
        gm.addObserver(display);
        gm.notifyObservers("Player attacked");
        
        assertTrue(display.getEvents().contains("Player attacked"), 
            "GameDisplay should store and provide access to received events");
    }

    @Test
    @DisplayName("Observer Pattern: GameLogger should log events")
    public void testGameLoggerLogsEvents() {
        GameManager gm = GameManager.getInstance();
        GameLogger logger = new GameLogger();
        
        gm.addObserver(logger);
        
        // This test mainly ensures GameLogger doesn't throw exceptions
        assertDoesNotThrow(() -> {
            gm.notifyObservers("Test event");
        }, "GameLogger should handle event logging without exceptions");
    }

    @Test
    @DisplayName("Game Logic: PlayTurn should update character health")
    public void testPlayTurnUpdatesHealth() {
        GameManager gm = GameManager.getInstance();
        Character attacker = new Character("Hero", 100, 20, new AggressiveStrategy());
        Character defender = new Character("Orc", 100, 10, new DefensiveStrategy());
        
        gm.playTurn(attacker, defender);
        
        // At least one character should have different health after a turn
        boolean healthChanged = attacker.getHealth() != 100 || defender.getHealth() != 100;
        assertTrue(healthChanged, "After playTurn, at least one character's health should change");
    }

    @Test
    @DisplayName("Character: Health should be constrained between 0 and 100")
    public void testHealthConstraints() {
        Character character = new Character("Test", 50, 30, new AggressiveStrategy());
        
        // Test health doesn't go below 0
        character.setHealth(-10);
        assertEquals(0, character.getHealth(), "Health should not go below 0");
        
        // Test health doesn't exceed 100
        character.setHealth(150);
        assertEquals(100, character.getHealth(), "Health should not exceed 100");
    }

    @Test
    @DisplayName("Character: Attack power should be positive")
    public void testAttackPowerValidation() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Character("Invalid", 100, -5, new AggressiveStrategy());
        }, "Character should not accept negative attack power");
    }

    @Test
    @DisplayName("GameManager: Should handle multiple observers")
    public void testMultipleObservers() {
        GameManager gm = GameManager.getInstance();
        GameDisplay display1 = new GameDisplay();
        GameDisplay display2 = new GameDisplay();
        
        gm.addObserver(display1);
        gm.addObserver(display2);
        gm.notifyObservers("Multi-observer test");
        
        assertTrue(display1.getEvents().contains("Multi-observer test"), 
            "First observer should receive event");
        assertTrue(display2.getEvents().contains("Multi-observer test"), 
            "Second observer should receive event");
    }

    @Test
    @DisplayName("Integration: Complete game flow with all patterns")
    public void testCompleteGameFlow() {
        GameManager gm = GameManager.getInstance();
        GameDisplay display = new GameDisplay();
        
        gm.addObserver(display);
        
        Character hero = new Character("Hero", 100, 25, new AggressiveStrategy());
        Character monster = new Character("Monster", 80, 15, new DefensiveStrategy());
        
        // Play multiple turns
        gm.playTurn(hero, monster);
        gm.playTurn(monster, hero);
        
        // Verify events were recorded
        assertFalse(display.getEvents().isEmpty(), "Game events should be recorded");
        
        // Verify characters are still alive (health > 0)
        assertTrue(hero.getHealth() > 0, "Hero should still be alive");
        assertTrue(monster.getHealth() > 0, "Monster should still be alive");
    }
}
