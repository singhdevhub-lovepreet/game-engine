# Assignment Submission Guidelines

## 📋 Before You Start

1. **Read the README.md** carefully to understand the requirements
2. **Run the tests** to see what needs to be implemented: `mvn test`
3. **Study the test cases** - they are your specification!

## 🎯 Implementation Order (Recommended)

### Phase 1: Basic Classes
1. **Character.java** - Start here! It's the foundation
2. **MoveStrategy.java** - Define the strategy interface
3. **AggressiveStrategy.java** - Implement attack behavior
4. **DefensiveStrategy.java** - Implement heal behavior

### Phase 2: Observer Pattern
5. **GameObserver.java** - Define observer interface
6. **GameDisplay.java** - Store events for display
7. **GameLogger.java** - Log events to console

### Phase 3: Singleton Pattern
8. **GameManager.java** - Implement singleton with observer management

### Phase 4: Advanced Strategy
9. **RandomStrategy.java** - Implement random behavior

## 🧪 Testing Your Implementation

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=GameEngineTest#testSingletonIntegrity

# Compile only
mvn compile
```

## 📝 Code Quality Checklist

- [ ] All classes compile without errors
- [ ] All tests pass
- [ ] Code follows Java naming conventions
- [ ] Proper encapsulation (private fields, public methods)
- [ ] Meaningful variable and method names
- [ ] Appropriate comments for complex logic

## 🚨 Common Pitfalls

1. **Health Constraints**: Remember health should be between 0-100
2. **Null Checks**: Handle null targets in defensive strategy
3. **Singleton Thread Safety**: Consider thread safety for singleton
4. **Observer Management**: Properly manage observer lists
5. **Strategy Interface**: Make sure all strategies implement the interface correctly

## 📊 Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| **Functionality** | 60% | All tests pass, correct behavior |
| **Code Quality** | 25% | Clean, readable, well-structured |
| **Design Patterns** | 15% | Proper implementation of patterns |

## 💡 Pro Tips

- **Use the tests as your guide** - they tell you exactly what behavior is expected
- **Start simple** - get basic functionality working first
- **Test frequently** - run tests after each major change
- **Read error messages** - they often point to the exact issue
- **Use your IDE** - leverage auto-completion and error highlighting

## 🆘 Getting Help

1. **Check compilation errors** first
2. **Read test failure messages** carefully
3. **Verify method signatures** match the interface
4. **Ensure proper imports** are included
5. **Check package declarations** are correct

---

**Remember: The tests are your friends! They will guide you to the correct implementation.**
