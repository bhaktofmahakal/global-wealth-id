# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - heading "Global Wealth ID" [level=1] [ref=e3]
    - generic [ref=e4]:
      - generic [ref=e6]:
        - heading "Convert Credit Score" [level=2] [ref=e7]
        - generic [ref=e8]:
          - generic [ref=e9]: Credit Score
          - spinbutton [ref=e10]
        - generic [ref=e11]:
          - generic [ref=e12]: From Country
          - combobox [ref=e13]:
            - option "USA" [selected]
            - option "UK"
            - option "Germany"
            - option "Japan"
            - option "Australia"
        - generic [ref=e14]:
          - generic [ref=e15]: To Country
          - combobox [ref=e16]:
            - option "USA"
            - option "UK" [selected]
            - option "Germany"
            - option "Japan"
            - option "Australia"
        - generic [ref=e17]:
          - generic [ref=e18]: User Name (Optional)
          - textbox "Your name" [ref=e19]
        - button "Convert" [ref=e20] [cursor=pointer]
      - generic [ref=e22]:
        - heading "Recent Checks" [level=2] [ref=e23]
        - paragraph [ref=e24]: No recent checks
  - alert [ref=e25]
```