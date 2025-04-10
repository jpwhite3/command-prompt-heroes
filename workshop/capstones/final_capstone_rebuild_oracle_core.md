
# Command Prompt Heroes: The Oracle of Lost Knowledge  
## Final Capstone: Rebuild the Oracle Core

**Time:** ~30 minutes  
**Track:** Choose your path:  
- **Easy Mode** — Focus on targeted cleanup with basic Python  
- **Hard Mode** — Use `pandas` to fully restore and analyze the dataset  

---

## Narrative Brief

> You’ve reached the Oracle’s Core.  
> The system is fractured—corrupted files, missing values, broken protocols.  
>  
> This is where the old world fell.  
> And this is where you, a true **Command Prompt Hero**, begin to rebuild it.

---

## Your Mission

A file named `oracle_logs.csv` has been recovered from deep storage.  
It contains corrupted transaction records from the time before.

### Your goal is to:
1. **Clean** the data (standardize capitalization, fix types, remove blanks)
2. **Process** it (total counts, sums, or averages)
3. **Restore** it into a usable format

---

## Sample Data: `oracle_logs.csv`

```
Item,Qty,Price
widget,4,"2.50"
GADGET,2,3
,,,
Widget,one,2.50
Doodad,3,4.75
```

---

## Part 1 – Easy Mode

Use basic Python and the `csv` module to:
- Skip empty rows
- Convert prices and quantities to `float` / `int`
- Handle obvious errors (like "one" instead of 1)
- Print cleaned results and totals

**Helpful tools:**
```python
str.lower(), int(), float(), try/except, strip()
```

---

## Part 2 – Hard Mode

Use `pandas` to:
- Load and clean the CSV
- Drop empty or malformed rows
- Convert data types and normalize capitalization
- Calculate total revenue and most frequent item

**Example:**
```python
import pandas as pd

df = pd.read_csv("oracle_logs.csv")
df.dropna(inplace=True)
df["Item"] = df["Item"].str.lower()
df["Qty"] = pd.to_numeric(df["Qty"], errors="coerce")
df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
df.dropna(inplace=True)

df["Total"] = df["Qty"] * df["Price"]
print(df)
print("Grand Total:", df["Total"].sum())
```

---

## Victory Condition

You’ve taken something broken and made it readable, usable, meaningful.

That’s the heart of coding in the real world.

---

### Badge Earned: Core Rebuilder  
*(Collectible Sticker or Digital Token Idea)*  
You’ve restored the Oracle’s voice. The Archive pulses with new life.

---

### Bonus

As a true **Command Prompt Hero**, you’ve earned access to the Oracle’s final insight:
> “Those who control the command line… control the future.”

