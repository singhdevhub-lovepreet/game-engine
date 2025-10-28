# Solution Template

## 🎓 Complete Implementation Guide

### Character.java
```java
package com.game.engine.entity;

import com.game.engine.strategy.MoveStrategy;

public class Character {
    private String name;
    private int health;
    private int attackPower;
    private MoveStrategy strategy;
    
    public Character(String name, int health, int attackPower, MoveStrategy strategy) {
        if (attackPower < 0) {
            throw new IllegalArgumentException("Attack power cannot be negative");
        }
        this.name = name;
        this.health = Math.max(0, Math.min(100, health));
        this.attackPower = attackPower;
        this.strategy = strategy;
    }
    
    public String getName() { return name; }
    public int getHealth() { return health; }
    public int getAttackPower() { return attackPower; }
    public MoveStrategy getStrategy() { return strategy; }
    
    public void setHealth(int health) {
        this.health = Math.max(0, Math.min(100, health));
    }
    
    public void performMove(Character target) {
        strategy.execute(this, target);
    }
}
```

### MoveStrategy.java
```java
package com.game.engine.strategy;

import com.game.engine.entity.Character;

public interface MoveStrategy {
    void execute(Character performer, Character target);
}
```

### AggressiveStrategy.java
```java
package com.game.engine.strategy;

import com.game.engine.entity.Character;

public class AggressiveStrategy implements MoveStrategy {
    @Override
    public void execute(Character performer, Character target) {
        if (target != null) {
            int damage = performer.getAttackPower();
            target.setHealth(target.getHealth() - damage);
        }
    }
}
```

### DefensiveStrategy.java
```java
package com.game.engine.strategy;

import com.game.engine.entity.Character;

public class DefensiveStrategy implements MoveStrategy {
    @Override
    public void execute(Character performer, Character target) {
        performer.setHealth(performer.getHealth() + 5);
    }
}
```

### RandomStrategy.java
```java
package com.game.engine.strategy;

import com.game.engine.entity.Character;

public class RandomStrategy implements MoveStrategy {
    @Override
    public void execute(Character performer, Character target) {
        if (Math.random() < 0.5) {
            // Attack like aggressive strategy
            if (target != null) {
                int damage = performer.getAttackPower();
                target.setHealth(target.getHealth() - damage);
            }
        } else {
            // Heal like defensive strategy
            performer.setHealth(performer.getHealth() + 5);
        }
    }
}
```

### GameObserver.java
```java
package com.game.engine.observer;

public interface GameObserver {
    void update(String event);
}
```

### GameDisplay.java
```java
package com.game.engine.observer;

import java.util.ArrayList;
import java.util.List;

public class GameDisplay implements GameObserver {
    private List<String> events;
    
    public GameDisplay() {
        this.events = new ArrayList<>();
    }
    
    @Override
    public void update(String event) {
        events.add(event);
    }
    
    public List<String> getEvents() {
        return new ArrayList<>(events);
    }
    
    public void clearEvents() {
        events.clear();
    }
}
```

### GameLogger.java
```java
package com.game.engine.observer;

public class GameLogger implements GameObserver {
    @Override
    public void update(String event) {
        System.out.println("[LOG] " + event);
    }
}
```

### GameManager.java
```java
package com.game.engine.singleton;

import com.game.engine.entity.Character;
import com.game.engine.observer.GameObserver;
import java.util.ArrayList;
import java.util.List;

public class GameManager {
    private static GameManager instance;
    private List<GameObserver> observers;
    
    private GameManager() {
        this.observers = new ArrayList<>();
    }
    
    public static GameManager getInstance() {
        if (instance == null) {
            instance = new GameManager();
        }
        return instance;
    }
    
    public void addObserver(GameObserver observer) {
        observers.add(observer);
    }
    
    public void removeObserver(GameObserver observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers(String event) {
        for (GameObserver observer : observers) {
            observer.update(event);
        }
    }
    
    public void playTurn(Character character1, Character character2) {
        character1.performMove(character2);
        notifyObservers(character1.getName() + " performed move");
        
        character2.performMove(character1);
        notifyObservers(character2.getName() + " performed move");
    }
    
    public void clearObservers() {
        observers.clear();
    }
}
```

## 🎯 Key Learning Points

1. **Singleton Pattern**: Ensures single instance with lazy initialization
2. **Strategy Pattern**: Encapsulates algorithms and makes them interchangeable
3. **Observer Pattern**: Enables loose coupling between subject and observers
4. **Encapsulation**: Proper data hiding and validation
5. **Interface Segregation**: Clean, focused interfaces

