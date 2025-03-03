## Keyhook Interview Task
### Overview

* Implements main task and both bonus tasks (with caveats for employee creation, see below).
* Much of the implementation approaches production-ready _except_ for no tests at all to save time (I'd use RSpec & learn Jest unless other test frameworks were in use in a 'real' code base).
* Employee addition is not production-ready. It lacks a disable-with-activity indicator on the 'Add' button; successful addition is only indicated by self-closing and reloading the list. A notification / Rails flash-like system would be needed. There is only very crude validation and error handling (for server-side validation errors in particular) - in view of time already spent prior, I just used HTML 5 browser-implemented validation.

### Feature notes

* Responsive design everywhere, though the mobile view of the employees list's table header is a bit rough. I spent more time on this than is wise (devil's in the detail of how e.g. the department filter, spinner and text search all behave), but it was a solid way to get to grips with Tailwind.
* Crude but functional API response error handling everywhere, including the Departments menu.
* Carefully-considered slow response activity indicators. From step 4 (see commit notes below) onwards, you can start the Sinatra server with `SLEEPY=<float> bundle exec rackup -p 4567` to introduce a sleep of `<float>` seconds in all responses. Try `1.0` to get a good look at fades and spinners, `0.5` to get a feel for faster response behaviour and remove `SLEEPY=...` for fast responses, noting no spinner or fade flicker arising.
* Sorting employees by department name was not requested but is implemented, since it was ugly being able to sort on everything _except_ that column!
* Department filtering is done as a multi-select, since it was very little effort to add and is nice-to-have for users.

### Paths not taken

Sinatra could be configured to report things like exceptions as a JSON API payload but that seemed like overkill for the task at hand so I did not implement it - invalid JSON complaints will arise on the JavaScript side.

There is a handful of TODO notes in the code here and there which should be self-explanatory.

I found [this note](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/#:~:text=Why%20is%20React.fc%20not%20needed) in React documentation when I realised `React.FunctionComponent` existed and wanted to know why there was that and `React.FC` available. This seems to indicate that both can be removed from modern code bases, but the wording is a little confusing - it seems to go on to discuss _advantages_ of using those calls just after saying they can be removed, so on balance I stuck with `React.FC`.

### Commit notes

This is committed as five steps - base project, then four significant stepping stones described below. I was new to just about everything here except the Ruby language and ActiveRecord. In particular, it took me a while to realise that TypeScript checking was not being run by default and I had to execute `yarn build` for that resulting in embarrassing mistakes in the first couple of steps - which are present warts-and-all in the repository. The older code will make "interesting" reading, I'm sure.

The end-to-end diff [looks like this](https://github.com/pond/keyhook_code_test_updated-oct-23/compare/398c953...2c1bef4?w=1).

Stepwise, each includes a lot of internal tidying and sometimes code style switch-ups as I rapidly start to find my footing with the technologies at hand and some of what appear to be prevailing idioms:

1. Base project.
2. [Learning React / Tailwind / Sinatra / Graphiti / Spraypaint](https://github.com/pond/keyhook_code_test_updated-oct-23/commit/bc235c5cc6454516b1e15934e437c824c1aa73c4?w=1): Lists employees in a table, but does so without Tanstack. JavaScript works, but TypeScript has many errors.
3. [Learning Tanstack / More React](https://github.com/pond/keyhook_code_test_updated-oct-23/commit/d456ec4afc12021cbc16d1b60e61ad0d3d3343c9?w=1): Tanstack table, pagination, full name text search (**adds [`use-debounce`](https://www.npmjs.com/package/use-debounce)**) JavaScript works, but TypeScript has many errors.
4. [Learning TypeScript](https://github.com/pond/keyhook_code_test_updated-oct-23/commit/2bfa2980afcf2f3a48b6df41c23e83aa55595392?w=1): `yarn build` succeeds. Adds filter-by-department (**adds [`react-tailwindcss-select`](https://www.npmjs.com/package/react-tailwindcss-select)** for multi-select styling and what later proved to be very helpful decoupling of internal selected item state and the DOM, but it does not play nicely with keyboard navigation sadly).
5. [Learning Spraypaint / Graphiti-outside-Rails resource creation](https://github.com/pond/keyhook_code_test_updated-oct-23/commit/2c1bef45bd5f8d000d67264f36545e01a6171d64?w=1): More composition, type fixes, better internal API, recognise value of `react-tailwindcss-select`'s decoupled model since Spraypaint requires me to assign a Department resource to the Employee; it will sadly not let me just set `departmentId`. I can retain the Department array fetched for the select list and store the selected Department resource instance thanks to the decoupled state.

### Implementation notes

I aimed for component reuse in the implementation. I imagined questions like, "now, how would you add a list of departments?" when building the reusable List with its optional stack of filters (I'd add a `DepartmentNameFilter` component and specify that in the filter abilities). Further, what about a nested list of employees scoped by department, instead of or as an alternative to using the filter menu? Well, in that case we have - in Rails terms - a route along the lines of `.../departments/<department_id>/employees` and the button components array becomes useful. The "add employee" button would still be there but, potentially, we might also choose to offer an "edit department" button based on `<department_id>` for user convenience.

As a result, there are more components than might be expected. The approach is mostly based around composition, as I wasn't confident in how (or if) I should use subclassing with React components. The purpose of `frontend/src/interfaces` is an attempt to enforce compliance to certain interfaces for something that can be used in a certain reuse context (whereas with subclassing, we'd just say "type must be subclass of foo") - this has a loose analogy to Objective C protocols. I strongly suspect this demonstrates clearly my inexperience with React, but if I were in a real code base, I'd have a lot of other code to use as a reference instead of "rolling my own".

### Time spent

Due to the recent shoulder surgery and arising lack of sleep I could only work in short bursts. Even so I took longer on this than I hoped.

* Thu Feb 27 - 3 hours
* Fri Feb 28 - 6 hours
* Sat Mar 1 - 9 hours
* Sun Mar 2 - 7 hours
* Mon Mar 3 - 4 hours (mostly just documentation, re-testing, cleanup, GitHub).
