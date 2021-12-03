TODO:

- [x] Navigate to documents for editing them
  - [ ] Fix "This reference has been removed since you opened it."
- [ ] Handle replacing parents
- [ ] Handle focus
  - Or improve this behavior by following Desk structure's conventions
- [ ] Add a button to create new documents that match the GROQ filter, also following RiP's work
  - Refer to Refs. in Place - how is it doing it?
- [ ] Deal with drafts in `allItems`
  - [ ] Clarify that only published documents will show up in tree
  - they're currently being ignored, but we could potentially add a new list of "Draft documents - Publish them before adding to this list"
- [ ] React-sortable-tree is throwing weird errors sometimes
- [ ] Improve dropping response times
- [ ] Improve overall UX
  - Button to add unadded item to the bottom of the list, w/o drag 'n dropping?

Low priority:

- [ ] Is it feasible to animate the changes on drag?
- [ ] Custom diff component
- [ ] Utility for getting a node's parents, children and siblings?
  - Useful for extracting breadcrumbs in a front-end, for example
- [ ] GROQ helper functions
  - get the `_ref` of the parent of a given entry, picked by its `_ref`
  - get the children of a given entry, picked by its `_ref`

Check if fixed:

- [ ] Opening documents is janky & doesn't keep state
- [ ] Previews are vanishing on real-time changes from others
