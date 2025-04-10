
# Command Prompt Heroes: The Oracle of Lost Knowledge  
## Lab 5: The Conditional Gate

**Time:** ~7–10 minutes  
**Track:** Choose your path:  
- **Easy Mode** — Learn conditions  
- **Hard Mode** — Add logic inside functions  

---

## Narrative Brief

> You reach a sealed gate. It hums with power—but won’t budge.  
> A nearby console blinks:  
>  
> `ACCESS REQUIRES LOGIC`  
>  
> The Archive presents you with choices. Only correct answers—evaluated with true code—will open the path.

---

## Your Mission

Write a Python script that:
1. Asks the user a question
2. Decides what to do based on their answer
3. (Bonus) Wraps that logic in a function

---

## Part 1 – Easy Track

> **Goal:** Use `if` and `else` to make decisions.

### 1. Ask a Question:
```python
answer = input("Do you wish to proceed? (yes/no): ")
```

### 2. Check Their Answer:
```python
if answer == "yes":
    print("The gate unlocks...")
else:
    print("Access denied.")
```

---

## Part 2 – Hard Mode Challenge

> **Goal:** Create a function that contains conditional logic.

### 1. Define a Function:
```python
def unlock_gate(code):
    if code == "syntax":
        print("Gate opens. Welcome, Operative.")
    else:
        print("Incorrect code. Try again.")
```

### 2. Call the Function with User Input:
```python
user_code = input("Enter the gate code: ")
unlock_gate(user_code)
```

### 3. Bonus — Add More Logic:
```python
def unlock_gate(code):
    if code == "syntax":
        print("Gate opens. Welcome, Operative.")
    elif code == "override":
        print("Emergency access granted.")
    else:
        print("Incorrect code. Try again.")
```

---

## Checkpoint – What Just Happened?

Take a moment to reflect. Can you now:
- Use `if`, `else`, and `elif`?
- Write a basic function?
- Combine input, logic, and output in one script?

If yes, **you’ve passed the Conditional Gate.**

---

### Badge Earned: Logic Bearer  
*(Collectible Sticker or Digital Token Idea)*  
Your decisions now shape your path. The Archive trusts your judgment.
