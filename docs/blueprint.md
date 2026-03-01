# **App Name**: SnippetForge

## Core Features:

- Raw Source Input: A dedicated text area for pasting and editing raw source documents, enabling quick ingestion of unstructured text.
- AI-Assisted Snippet Extraction and Tagging: Leverage an AI tool to automatically suggest candidate snippets from raw text, pre-tagging them with a likely cluster and zone, which users can then review, modify, and confirm before adding to the review queue.
- Snippet Tagging Interface: An interactive interface allowing users to define and apply tags for each snippet: 'cluster' (dropdown), 'zone' (anchor/ticker/ghost), 'weight' (dropdown), 'attribution' (text field), and 'emphasis words' (comma-separated text field). This interface is also used to review and refine AI-suggested tags.
- Review Queue & Editor: A dynamic list displaying all extracted and tagged snippets, including their auto-generated unique ID (UUID). Provides inline editing capabilities for all fields and a 'delete' option for fine-tuning the content set.
- JSON Export to File: A button to generate and download a valid JSON file, formatted to match the '/content_items' Firestore schema, with each content item including its auto-generated unique ID (UUID), for mock data population or external use.
- Direct Firestore Write: An optional feature allowing users to directly push the structured snippet data, including each item's auto-generated unique ID (UUID), to the '/content_items/' collection in a specified Firestore project.

## Style Guidelines:

- Color scheme: Light. Primary (actions, interactive elements): A deep, muted indigo-blue (#294599), symbolizing clarity and structure. Background: A very light, desaturated blue-gray (#ECF0F7) for a clean, non-distracting canvas. Accent (highlights, alerts): A clear, bright cyan-blue (#289FDB) for distinct user feedback.
- All text: 'Inter' (sans-serif), chosen for its modern, highly readable, and neutral aesthetic, suitable for extensive text input and display in a functional tool.
- Minimalist line icons for core actions such as 'Export', 'Save', 'Edit', and 'Delete', ensuring intuitive navigation and a clean interface. Icons should maintain a consistent stroke weight and style.
- A responsive, two-column layout optimized for desktop, with the raw text input and tagging interface on one side and the review queue on the other. Consistent spacing and clear visual separators will define different functional areas.
- Subtle visual feedback for user interactions, such as slight button presses, hover effects, and a brief, elegant fade-in/fade-out for snippets added or removed from the review queue, enhancing user experience without distraction.