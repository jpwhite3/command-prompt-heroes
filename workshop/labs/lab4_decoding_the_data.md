
# Command Prompt Heroes: The Oracle of Lost Knowledge  
## Lab 4: Decoding the Data

**Time:** ~5–7 minutes  
**Track:** Choose your path:  
- **Easy Mode** — Start simple  
- **Hard Mode** — Go deeper, add polish  

---

## Narrative Brief

> You’ve discovered a sector called the Table Room—endless rows of unprocessed data.  
> To move forward, you must learn to scan and decode data in batches.  
>  
> Individual commands won’t help you now. It’s time to master data structures.

---

## Your Mission

Write a Python script to:
1. Create a list of values
2. Loop through each value and print it
3. (Bonus) Sum numerical values and display results

---

## Part 1 – Easy Track

> **Goal:** Create and process a simple list.

### 1. Make a List:
```python
items = ["Widget", "Gadget", "Doodad"]
```

### 2. Print Each Item:
```python
for item in items:
    print(item)
```

---

## Part 2 – Hard Mode Challenge

> **Goal:** Use advanced list techniques to process numbers.

### 1. Create a List of Numbers:
```python
prices = [2.50, 3.00, 1.20, 4.75]
```

### 2. Use `enumerate()`:
```python
for i, price in enumerate(prices):
    print(f"Item {i+1}: ${price:.2f}")
```

### 3. Sum the Values:
```python
total = sum(prices)
print(f"Total cost: ${total:.2f}")
```

---

## Checkpoint – What Just Happened?

Take a moment to reflect. Can you now:
- Store multiple values in a list?
- Loop through a list with `for`?
- Use `enumerate()` and `sum()`?

If yes, **you’ve decoded the Table Room.**

---

### Badge Earned: Data Diver  
*(Collectible Sticker or Digital Token Idea)*  
You now see patterns in chaos. The Archive reveals its hidden structures.
