TODO:

- [x] Form field wrapper on it to make presence, titles and descriptions work
- [x] Larger indent
- [x] Real-time changes to `allItems`
- [x] Clearer drop target on empty lists
  - Instead of using Callouts, use a dropzone with dashed borders
- [x] Collapse/expand
  - Will require new local state
- [x] Utility function for reconstructing tree
- [ ] Utility for getting a node's parents, children and siblings?
- [ ] Navigate to documents. I plan to use our work on Refs. in Place to open panes to the right for each category
- [ ] GROQ helper functions
- [ ] Handle replacing parents
- [ ] Handle focus
- [ ] Add a button to create new documents that match the GROQ filter, also following RiP's work
  - Refer to Refs. in Place - how is it doing it?
- [ ] Deal with drafts in `allItems`
  - they're currently being ignored, but we could potentially add a new list of "Draft documents - Publish them before adding to this list~
- [ ] React-sortable-tree is throwing weird errors sometimes
- [ ] Improve dropping response times

Low priority:

- [ ] Is it feasible to animate the changes on drag?
- [ ] Custom diff component

Check if fixed:

- [ ] Opening documents is janky & doesn't keep state
- [ ] Previews are vanishing on real-time changes from others
