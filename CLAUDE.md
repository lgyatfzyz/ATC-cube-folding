# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a pure HTML/CSS/JavaScript project with no build process. To run:
- Open `index.html` directly in a browser to start the game
- Open test files (`test-*.html`) directly in a browser for testing specific functionality

## Architecture Overview

### Core Concept
A web-based cube folding test game where players identify which 3D cube corresponds to a given 2D net (unfolded cube pattern). The game tests spatial reasoning by showing a flat pattern and asking users to select the correct folded cube from 4 options.

### Critical Architecture Principle: Position-Based Adjacency System
**This is the most important architectural decision in the codebase.** The adjacency relationships between cube faces are defined based on **position indices in the net pattern** (0-5), NOT based on the face numbers (1-6). This design choice resolves a fundamental conflict between random face number assignment and geometric validation logic.

#### Why Position-Based?
- Face numbers (1-6) are randomly assigned to positions for variety
- Adjacency relationships depend on **geometric positions** in the net, not the numbers
- Each net type (Cross, T, Z, L) has its own position adjacency rules
- This allows random face assignment while maintaining geometric accuracy

### Module Architecture

**3-Layer Architecture:**
1. **adjacency.js** - Core geometric logic and position-based adjacency system
2. **cube.js** - Game logic, net generation, and answer validation  
3. **main.js** - UI control, game flow, and user interaction

### Key Data Structures

**Net Definition:**
```javascript
{
    name: '十字形',           // Net type name
    pattern: [[0,1,2], ...], // [row, col, face_number] positions
    gridSize: [3, 4]         // Grid dimensions
}
```

**Position Adjacency Tables:**
```javascript
const CROSS_POSITION_ADJACENCY = {
    0: [1, 2, 3, 4],  // Position 0 adjacent to positions 1,2,3,4
    1: [0, 2, 4, 5],  // etc.
    // ...
};
```

**Cube Vertex Definitions (Per Net Type):**
Each net type has independent vertex definitions mapping position indices to valid 3-face combinations that can meet at a cube vertex.

### Exhaustive Vertex Enumeration System

The game uses **exhaustive enumeration** of cube vertices rather than heuristic validation:
- Defines all 8 vertices of a cube for each net type
- Each vertex specifies 3 positions that can meet at that vertex
- Generates all valid 3-face combinations from vertex templates
- Correct answers selected from valid list; wrong answers generated outside the list
- This ensures geometric accuracy and eliminates validation ambiguity

### Multi-Net Support

**4 Supported Net Types:**
- 十字形 (Cross) - Most common
- T形 (T-shape) 
- Z形 (Z-shape)
- L形 (L-shape)

Each has independent:
- Position adjacency tables in `adjacency.js`
- Cube vertex definitions 
- Template patterns in `CUBE_NETS`

### CSS 3D Rendering System

Uses CSS transforms to render 3D cubes showing exactly 3 faces (front, left, top):
```css
transform: rotateX(-25deg) rotateY(-45deg);
```

6 distinct gradient colors map consistently between 2D nets and 3D cubes.

## Critical Implementation Details

### Function Execution Order
1. `setAdjacencyForNet(netType)` - MUST be called before validation functions
2. `generateRandomNet()` - Creates net with random face assignments
3. `generateCorrectAnswerFromValidList()` - Uses exhaustive enumeration for correct answer
4. `generateWrongAnswerNotInList()` - Generates invalid combinations for wrong options

### Validation Flow
- `generateAllValidThreeFaceCombinations()` enumerates all valid vertex combinations for a net
- `isThreeFaceCombinationValid()` checks if a combination exists in the valid list
- `canMeetAtVertex()` uses exhaustive checking rather than geometric heuristics

### Global State Management
Critical global functions exposed via `window` object:
- Adjacency functions: `isAdjacent()`, `canMeetAtVertex()`
- Net-specific functions: `getCurrentNetType()`, `setAdjacencyForNet()`
- Exhaustive enumeration: `generateAllValidThreeFaceCombinations()`

## Testing Infrastructure

**4 Test Files for Different Validation Layers:**
- `test-six-faces.html` - Full 6-face cube validation (recommended for core testing)
- `test-position-adjacency.html` - Position-based adjacency system testing  
- `final-verification.html` - Comprehensive system verification
- `multi-adjacency-test.html` - Legacy unified testing platform

**Test Execution Order:** Run six-faces → position-adjacency → final-verification

## Error Patterns to Avoid

1. **Never validate adjacency using face numbers directly** - always use position-based adjacency
2. **Never mix vertex definitions between net types** - each net has independent geometry
3. **Always call `setAdjacencyForNet()` before any validation** - adjacency tables must match current net
4. **Never assume face numbers follow patterns** - they are randomly assigned to positions

## Key Files by Concern

**Core Logic:**
- `js/adjacency.js` - Position adjacency tables, exhaustive vertex enumeration
- `js/cube.js` - Net templates, answer generation, validation logic

**Game Flow:**
- `js/main.js` - UI management, game state, error handling
- `index.html` - Main game interface

**Testing:**
- `test-six-faces.html` - Primary validation testing
- `test-position-adjacency.html` - Adjacency system testing

## Development Philosophy (from .cursorrules)

- **Simplicity First:** HTML/CSS/JS only, designed for middle school students
- **Apple Aesthetic:** Modern, clean visual design following Apple design principles  
- **Comprehensive Testing:** Multi-layer testing system covering edge cases
- **Clear Code Structure:** Each functional area in separate files with detailed comments