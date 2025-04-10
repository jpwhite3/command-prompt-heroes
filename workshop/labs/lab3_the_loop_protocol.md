
# Command Prompt Heroes: The Oracle of Lost Knowledge  
## Lab 3: The Loop Protocol

**Time:** ~5–7 minutes  
**Track:** Choose your path:  
- **Easy Mode** — You’re brand new  
- **Hard Mode** — You’ve tinkered before  

---

## Narrative Brief

> The Oracle responds—but only once.  
> You must teach it to repeat.  
> A script called `repeater.py` appears, half-written, awaiting your command.  
>  
> To progress deeper into the Archive, you must master the Protocol of Loops.

---

## Part 1 – Simple Loops (Both Tracks)

> **Goal:** Use a `for` loop to repeat a message multiple times.

### 1. Locate the File:
```bash
ls      # Mac/Linux
dir     # Windows
```
_Look for `repeater.py`_

### 2. Open the File:
```bash
nano repeater.py     # Mac/Linux
notepad repeater.py  # Windows
```

### 3. Add a Loop:
Paste or modify the code:
```python
for i in range(5):
    print("The signal is strong.")
```

### 4. Run the Script:
```bash
python repeater.py
```
_The message should appear five times._

---

## Part 2 – Bonus Challenge (Hard Mode)

> **Optional Challenge:** Customize your loop with variables and user input.

### 1. Use a Variable in the Message:
```python
for i in range(3):
    print("Message number", i + 1)
```

### 2. Let the User Choose How Many Times:
```python
count = int(input("How many signals to send? "))
for i in range(count):
    print(f"Signal {i + 1} sent.")
```

---

## Checkpoint – What Just Happened?

Take a moment to reflect. Can you now:
- Use a `for` loop in Python?
- Control how many times something runs?
- Accept user input?

If yes, **you’ve activated the Loop Protocol.**

---

### Badge Earned: Signal Repeater  
*(Collectible Sticker or Digital Token Idea)*  
Your messages now echo through the Archive, stronger with every repetition.
