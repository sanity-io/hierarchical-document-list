TODO:

- [x] Form field wrapper on it to make presence, titles and descriptions work
- [x] Larger indent
- [x] Real-time changes to `allItems`
- [x] Clearer drop target on empty lists
  - Instead of using Callouts, use a dropzone with dashed borders
- [ ] Collapse/expand
  - Will require new local state
- [ ] Handle replacing parents
- [ ] Handle focus
- [ ] Custom diff component
- [ ] Navigate to documents. I plan to use our work on Refs. in Place to open panes to the right for each category
- [ ] Add a button to create new documents that match the GROQ filter, also following RiP's work :slightly_smiling_face:
  - Refer to Refs. in Place - how is it doing it?
- [ ] Deal with drafts in `allItems`
  - they're currently being ignored, but we could potentially add a new list of "Draft documents - Publish them before adding to this list~
- [ ] Callouts could look better
- [ ] React-sortable-tree is throwing weird errors sometimes
- [ ] Avoid importing CSS from react-sortable-tree
- [ ] Improve drag 'n dropping
- [ ] Is it feasible to animate the changes on drag?

Check if fixed:

- [ ] Opening documents is janky & doesn't keep state
- [ ] Previews are vanishing on real-time changes from others
