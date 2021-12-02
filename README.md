Complexities to handle

- How to avoid crazy re-renders of documents' `<Preview>`?
  - Seems to be smart
- How to listen to tree changes without painful re-renders when we patch it?
  - Potentially save the mutation's ID to a store and skip it when it comes back from listen?
    - PatchResult.transactionId
- How add new documents when there are multiple types possible?
  - S.documentList can't handle this very well
  - Perhaps I could do `documentTypes` as an array & auto generate the buttons that way?
- How ensure to simultaneous changes don't overwrite each-other?
  - I'll need to use fine-grained patches
  - Probably consult with studio how they approach this, I had a hard time untangling the keyed patch logic.

MVP:

- can open & edit documents
- Can configure multiple ToCs
- Can move items from one list to the other

TODO:

- [x] Dragging items feels weird - add the hints used by default styles
- [x] Real-time changes
  - [x] Surgical patches
  - [x] Avoid local mutation
    - I can pass a `nanoid`-generated id to `transaction().transactionId()` & store it in `localTransactions`
    - The sad thing is that `client.listen.subscribe(observer)` will use a static version of `observer`, so accessing `localTransactions` isn't easy.
    - I'll also probably need to use `React.useReducer` instead of `useState` for `data` so that I can rely on the previous value to update only `data.mainTree`
- [ ] Deal with drafts in `allItems`
  - they're currently being ignored, but we could potentially add a new list of "Draft documents - Publish them before adding to this list~
- [ ] Real-time changes to `allItems`
- [ ] Callouts are ugly
- [ ] Avoid importing CSS from react-sortable-tree
- [ ] Improve drag 'n dropping
- [ ] Opening documents is janky & doesn't keep state
- [ ] Weak references
- [ ] Persistence failing
  - I think it has to do with patches being ignored
- [ ] Previews are vanishing on real-time changes from others
- [ ] Clearer drop target on empty
- [ ] Larger indent
- [ ] Is it feasible to animate the change?
- [ ] Pair programming with Bjoerge?
- [ ] Chevrons instead of expand/contract icons

## V2 - rearchitecture to flat lists

- Flat lists with `level: number` property
  - Q:
