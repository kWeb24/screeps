const layouts = {
  base: {
    core: {
      size: {
        x: 9,
        y: 7,
      },
      levels: [
        [
          // 1
          { type: 'road', pos: [3, 0] },
          { type: 'road', pos: [4, 0] },
          { type: 'road', pos: [5, 0] },
          { type: 'road', pos: [2, 1] },
          { type: 'road', pos: [4, 1] },
          { type: 'road', pos: [6, 1] },
          { type: 'road', pos: [1, 2] },
          { type: 'road', pos: [2, 2] },
          { type: 'road', pos: [4, 2] },
          { type: 'road', pos: [6, 2] },
          { type: 'road', pos: [7, 2] },
          { type: 'road', pos: [0, 3] },
          { type: 'road', pos: [3, 3] },
          { type: 'road', pos: [5, 3] },
          { type: 'road', pos: [5, 3] },
          { type: 'road', pos: [8, 3] },
          { type: 'road', pos: [7, 3] },
          { type: 'road', pos: [7, 3] },
          { type: 'road', pos: [1, 4] },
          { type: 'road', pos: [2, 4] },
          { type: 'road', pos: [4, 4] },
          { type: 'road', pos: [6, 4] },
          { type: 'road', pos: [7, 4] },
          { type: 'road', pos: [2, 5] },
          { type: 'road', pos: [4, 5] },
          { type: 'road', pos: [6, 5] },
          { type: 'road', pos: [3, 6] },
          { type: 'road', pos: [4, 6] },
          { type: 'road', pos: [5, 6] },
          { type: 'spawn', pos: [6, 3] },
        ],
        [
          // 2
          { type: 'wall', pos: [0, 0] },
          { type: 'wall', pos: [1, 0] },
          { type: 'wall', pos: [2, 0] },
          { type: 'wall', pos: [6, 0] },
          { type: 'wall', pos: [7, 0] },
          { type: 'wall', pos: [8, 0] },
          { type: 'wall', pos: [0, 1] },
          { type: 'wall', pos: [1, 1] },
          { type: 'wall', pos: [7, 1] },
          { type: 'wall', pos: [8, 1] },
          { type: 'wall', pos: [0, 2] },
          { type: 'wall', pos: [8, 2] },

          { type: 'wall', pos: [0, 4] },
          { type: 'wall', pos: [8, 4] },
          { type: 'wall', pos: [0, 5] },
          { type: 'wall', pos: [1, 5] },
          { type: 'wall', pos: [7, 5] },
          { type: 'wall', pos: [8, 5] },
          { type: 'wall', pos: [0, 6] },
          { type: 'wall', pos: [1, 6] },
          { type: 'wall', pos: [2, 6] },
          { type: 'wall', pos: [6, 6] },
          { type: 'wall', pos: [7, 6] },
          { type: 'wall', pos: [8, 6] },

        ],
        [
          // 3
          { type: 'tower', pos: [7, 3] },
        ],
        [
          // 4
          { type: 'link', pos: [4, 3] },
          { type: 'storage', pos: [5, 4] },
        ],
        [
          // 5
          { type: 'tower', pos: [5, 5] },
        ],
        [
          // 6
          { type: 'terminal', pos: [3, 2] },
        ],
        [
          // 7
          { type: 'tower', pos: [5, 1] },
          { type: 'factory', pos: [3, 4] },
        ],
        [
          // 8
          { type: 'powerSpawn', pos: [2, 3] },
          { type: 'tower', pos: [3, 1] },
          { type: 'tower', pos: [1, 3] },
          { type: 'tower', pos: [3, 5] },
          { type: 'nuke', pos: [5, 2] },
        ],
      ],
    }
  }
};

export default layouts;
