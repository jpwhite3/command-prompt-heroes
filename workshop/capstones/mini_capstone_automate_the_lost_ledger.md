
# Command Prompt Heroes: The Oracle of Lost Knowledge  
## Mini-Capstone: Automate the Lost Ledger

**Time:** ~10–15 minutes  
**Track:** Choose your path:  
- **Easy Mode** — Start simple  
- **Hard Mode** — Go deeper, add polish  

---

## Narrative Brief

> You’ve reached the Data Vault.  
> Inside is a crude ledger—columns of raw numbers and repeated actions.  
> The past operators ran calculations line-by-line, day after day.  
>  
> They never discovered automation. You will.

A file named `ledger.csv` appears. It contains sales data that once had to be processed by hand.

---

## Your Mission

Write a Python script to:
1. Read the file
2. Multiply each `Qty * Price`
3. Print the result for each row

**Bonus Objectives:**
- Calculate the grand total of all transactions
- Format the output neatly (labels, currency, spacing)

---

## Sample Input: `ledger.csv`

```
Item,Qty,Price
Widget,4,2.50
Gadget,2,3.00
Widget,1,2.50
```

---

## Part 1 – Easy Track

> **Goal:** Use basic file reading and string manipulation

### 1. Open and Read the File:
```python
with open("ledger.csv") as file:
    lines = file.readlines()
```

### 2. Skip the Header and Loop Through Lines:
```python
for line in lines[1:]:
    item, qty, price = line.strip().split(",")
    total = int(qty) * float(price)
    print(f"{item}: ${total}")
```

---

## Part 2 – Hard Mode Challenge

> **Goal:** Use Python's `csv` module and format your results

### 1. Use the CSV Module:
```python
import csv

with open("ledger.csv", newline='') as file:
    reader = csv.DictReader(file)
    grand_total = 0
    for row in reader:
        item = row["Item"]
        qty = int(row["Qty"])
        price = float(row["Price"])
        total = qty * price
        grand_total += total
        print(f"{item}: ${total:.2f}")
    print(f"Grand Total: ${grand_total:.2f}")
```

---

## Checkpoint – What Just Happened?

Take a moment to reflect. Can you now:
- Read structured data from a file?
- Process each row using variables and math?
- Use Python to automate a simple business task?

If yes, **you’ve reclaimed the power of automation.**

---

### Badge Earned: Ledgerbreaker  
*(Collectible Sticker or Digital Token Idea)*  
You’ve freed the past from repetition. The Archive recognizes your skill.
