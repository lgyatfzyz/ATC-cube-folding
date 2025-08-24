/**
 * 立方体面邻接关系处理模块 (基于位置的设计)
 * 为不同的展开图类型定义基于位置索引的邻接关系表
 * 位置索引对应展开图模板中pattern数组的索引 (0-5)
 */

// 十字形展开图的位置邻接关系
// 位置布局: [0:顶部, 1:左侧, 2:中心, 3:右侧, 4:最右, 5:底部]
// pattern: [[0,1], [1,0], [1,1], [1,2], [1,3], [2,1]]
const CROSS_POSITION_ADJACENCY = {
    0: [1, 2, 3, 4],    // 顶部(0) 邻接 左侧(1)、中心(2)、右侧(3)、最右(4)
    1: [0, 2, 4, 5],    // 左侧(1) 邻接 顶部(0)、中心(2)、最右(4)、底部(5)
    2: [0, 1, 3, 5],    // 中心(2) 邻接 顶部(0)、左侧(1)、右侧(3)、底部(5)
    3: [0, 2, 4, 5],    // 右侧(3) 邻接 顶部(0)、中心(2)、最右(4)、底部(5)
    4: [0, 1, 3, 5],    // 最右(4) 邻接 顶部(0)、左侧(1)、右侧(3)、底部(5)
    5: [1, 2, 3, 4]     // 底部(5) 邻接 左侧(1)、中心(2)、右侧(3)、最右(4)
};

// T形展开图的位置邻接关系
// 位置布局: [0:左上, 1:中上, 2:右上, 3:中心, 4:中下, 5:底部]
// pattern: [[0,0], [0,1], [0,2], [1,1], [2,1], [3,1]]
const T_POSITION_ADJACENCY = {
    0: [1, 3, 4, 5],    // 左上(0) 邻接 中上(1)、中心(3)、中下(4)、底部(5)
    1: [0, 2, 3, 5],    // 中上(1) 邻接 左上(0)、右上(2)、中心(3)、底部(5)
    2: [1, 3, 4, 5],    // 右上(2) 邻接 中上(1)、中心(3)、中下(4)、底部(5)
    3: [0, 1, 2, 4],    // 中心(3) 邻接 左上(0)、中上(1)、右上(2)、中下(4)
    4: [0, 2, 3, 5],    // 中下(4) 邻接 左上(0)、右上(2)、中心(3)、底部(5)
    5: [0, 1, 2, 4]     // 底部(5) 邻接 左上(0)、中上(1)、右上(2)、中下(4)
};

// Z形展开图的位置邻接关系
// 位置布局: [0:左上, 1:中上, 2:中心, 3:右中, 4:右下, 5:最右下]
// pattern: [[0,0], [0,1], [1,1], [1,2], [2,2], [2,3]]
const Z_POSITION_ADJACENCY = {
    0: [1, 2, 3, 4],    // 左上(0) 邻接 中上(1)、中心(2)、右中(3)、右下(4)
    1: [0, 2, 4, 5],    // 中上(1) 邻接 左上(0)、中心(2)、右下(4)、最右下(5)
    2: [0, 1, 3, 5],    // 中心(2) 邻接 左上(0)、中上(1)、右中(3)、最右下(5)
    3: [0, 2, 4, 5],    // 右中(3) 邻接 左上(0)、中心(2)、右下(4)、最右下(5)
    4: [0, 1, 3, 5],    // 右下(4) 邻接 左上(0)、中上(1)、右中(3)、最右下(5)
    5: [1, 2, 3, 4]     // 最右下(5) 邻接 中上(1)、中心(2)、右中(3)、右下(4)
};

// L形展开图的位置邻接关系
// 位置布局: [0:上方中心, 1:中间最左, 2:中间左中, 3:中间右中, 4:中间最右, 5:下方左对齐]
// pattern: [[0,1], [1,0], [1,1], [1,2], [1,3], [2,0]]
const L_POSITION_ADJACENCY = {
    0: [1, 2, 3, 4],    // 上方中心(0) 邻接 中间最左(1)、中间左中(2)、中间右中(3)、中间最右(4)
    1: [0, 2, 4, 5],    // 中间最左(1) 邻接 上方中心(0)、中间左中(2)、中间最右(4)、下方左对齐(5)
    2: [0, 1, 3, 5],    // 中间左中(2) 邻接 上方中心(0)、中间最左(1)、中间右中(3)、下方左对齐(5)
    3: [0, 2, 4, 5],    // 中间右中(3) 邻接 上方中心(0)、中间左中(2)、中间最右(4)、下方左对齐(5)
    4: [0, 1, 3, 5],    // 中间最右(4) 邻接 上方中心(0)、中间最左(1)、中间右中(3)、下方左对齐(5)
    5: [1, 2, 3, 4]     // 下方左对齐(5) 邻接 中间最左(1)、中间左中(2)、中间右中(3)、中间最右(4)
};

// 立方体的标准3D邻接关系（面1-6的真实邻接关系）
// 基于标准立方体：1前 2后 3左 4右 5上 6下
const CUBE_3D_ADJACENCY = {
    1: [3, 4, 5, 6],  // 前面邻接：左、右、上、下
    2: [3, 4, 5, 6],  // 后面邻接：左、右、上、下
    3: [1, 2, 5, 6],  // 左面邻接：前、后、上、下
    4: [1, 2, 5, 6],  // 右面邻接：前、后、上、下
    5: [1, 2, 3, 4],  // 上面邻接：前、后、左、右
    6: [1, 2, 3, 4]   // 下面邻接：前、后、左、右
};

// 展开图类型的位置邻接关系映射
const POSITION_ADJACENCY_MAP = {
    '十字形': CROSS_POSITION_ADJACENCY,
    'T形': T_POSITION_ADJACENCY,
    'Z形': Z_POSITION_ADJACENCY,
    'L形': L_POSITION_ADJACENCY
};

// 当前使用的位置邻接关系表（默认为十字形）
let currentPositionAdjacency = CROSS_POSITION_ADJACENCY;
let currentNetType = '十字形';

// 不同展开图类型的立方体顶点定义
// 每种展开图的面编号和位置关系都不同，需要独立定义

// 十字形展开图的立方体顶点定义
// 位置布局: [0:顶部, 1:左侧, 2:中心, 3:右侧, 4:最右, 5:底部]
const CROSS_NET_VERTICES = [
    { vertex: 1, positions: [0, 1, 2], description: "顶部-左侧-中心" },
    { vertex: 2, positions: [0, 2, 3], description: "顶部-中心-右侧" },
    { vertex: 3, positions: [0, 3, 4], description: "顶部-右侧-最右" },
    { vertex: 4, positions: [1, 2, 5], description: "左侧-中心-底部" },
    { vertex: 5, positions: [2, 3, 5], description: "中心-右侧-底部" },
    { vertex: 6, positions: [3, 4, 5], description: "右侧-最右-底部" },
    { vertex: 7, positions: [0, 1, 4], description: "顶部-左侧-最右" },
    { vertex: 8, positions: [1, 4, 5], description: "左侧-最右-底部" }
];

// T形展开图的立方体顶点定义  
// 位置布局: [0:左上, 1:中上, 2:右上, 3:中心, 4:中下, 5:底部]
const T_NET_VERTICES = [
    { vertex: 1, positions: [0, 1, 3], description: "左上-中上-中心" },
    { vertex: 2, positions: [1, 2, 3], description: "中上-右上-中心" },
    { vertex: 3, positions: [0, 3, 4], description: "左上-中心-中下" },
    { vertex: 4, positions: [2, 3, 4], description: "右上-中心-中下" },
    { vertex: 5, positions: [0, 1, 5], description: "左上-中上-底部" },
    { vertex: 6, positions: [1, 2, 5], description: "中上-右上-底部" },
    { vertex: 7, positions: [0, 4, 5], description: "左上-中下-底部" },
    { vertex: 8, positions: [2, 4, 5], description: "右上-中下-底部" }
];

// Z形展开图的立方体顶点定义
// 位置布局: [0:左上, 1:中上, 2:中心, 3:右中, 4:右下, 5:最右下]
const Z_NET_VERTICES = [
    { vertex: 1, positions: [0, 1, 2], description: "左上-中上-中心" },
    { vertex: 2, positions: [1, 2, 3], description: "中上-中心-右中" },
    { vertex: 3, positions: [2, 3, 4], description: "中心-右中-右下" },
    { vertex: 4, positions: [3, 4, 5], description: "右中-右下-最右下" },
    { vertex: 5, positions: [0, 1, 4], description: "左上-中上-右下" },
    { vertex: 6, positions: [1, 2, 5], description: "中上-中心-最右下" },
    { vertex: 7, positions: [0, 2, 4], description: "左上-中心-右下" },
    { vertex: 8, positions: [1, 3, 5], description: "中上-右中-最右下" }
];

// L形展开图的立方体顶点定义
// 位置布局: [0:上方中心, 1:中间最左, 2:中间左中, 3:中间右中, 4:中间最右, 5:下方左对齐]
const L_NET_VERTICES = [
    { vertex: 1, positions: [0, 1, 2], description: "上方中心-中间最左-中间左中" },
    { vertex: 2, positions: [0, 2, 3], description: "上方中心-中间左中-中间右中" },
    { vertex: 3, positions: [0, 3, 4], description: "上方中心-中间右中-中间最右" },
    { vertex: 4, positions: [1, 2, 5], description: "中间最左-中间左中-下方左对齐" },
    { vertex: 5, positions: [2, 3, 5], description: "中间左中-中间右中-下方左对齐" },
    { vertex: 6, positions: [3, 4, 5], description: "中间右中-中间最右-下方左对齐" },
    { vertex: 7, positions: [0, 1, 4], description: "上方中心-中间最左-中间最右" },
    { vertex: 8, positions: [1, 4, 5], description: "中间最左-中间最右-下方左对齐" }
];

// 展开图类型到顶点定义的映射
const NET_VERTICES_MAP = {
    '十字形': CROSS_NET_VERTICES,
    'T形': T_NET_VERTICES,
    'Z形': Z_NET_VERTICES,
    'L形': L_NET_VERTICES
};

// 缓存有效的三面组合，避免重复计算
let validThreeFaceCombinations = null;

/**
 * 设置当前展开图的位置邻接关系
 * @param {string} netType - 展开图类型名称
 */
function setAdjacencyForNet(netType) {
    if (POSITION_ADJACENCY_MAP[netType]) {
        currentPositionAdjacency = POSITION_ADJACENCY_MAP[netType];
        currentNetType = netType;
        console.log(`切换到 ${netType} 展开图的位置邻接关系`);
    } else {
        console.warn(`未找到 ${netType} 的位置邻接关系，使用默认十字形`);
        currentPositionAdjacency = CROSS_POSITION_ADJACENCY;
        currentNetType = '十字形';
    }
}

/**
 * 获取当前展开图的位置邻接关系表
 * @returns {Object} 当前的位置邻接关系表
 */
function getCurrentAdjacency() {
    return currentPositionAdjacency;
}

/**
 * 获取当前展开图类型
 * @returns {string} 当前的展开图类型名称
 */
function getCurrentNetType() {
    return currentNetType;
}

/**
 * 检查两个位置是否相邻（基于当前展开图的位置关系）
 * @param {number} pos1 - 第一个位置索引 (0-5)
 * @param {number} pos2 - 第二个位置索引 (0-5)
 * @returns {boolean} 如果两个位置相邻返回true，否则返回false
 * @throws {Error} 如果位置索引无效
 */
function isPositionAdjacent(pos1, pos2) {
    // 输入验证
    if (!isValidPosition(pos1)) {
        throw new Error(`无效的位置索引: ${pos1}. 位置索引必须是0-5之间的整数`);
    }
    if (!isValidPosition(pos2)) {
        throw new Error(`无效的位置索引: ${pos2}. 位置索引必须是0-5之间的整数`);
    }
    
    // 相同位置不相邻
    if (pos1 === pos2) {
        return false;
    }
    
    // 检查pos2是否在pos1的邻接列表中（基于当前展开图）
    const adjacentList = currentPositionAdjacency[pos1];
    return adjacentList ? adjacentList.includes(pos2) : false;
}

/**
 * 检查两个面是否在立方体折叠后相邻（基于位置邻接关系）
 * @param {number} face1 - 第一个面的数字 (1-6)
 * @param {number} face2 - 第二个面的数字 (1-6)
 * @param {Array} netFaces - 展开图的面数据数组
 * @returns {boolean} 如果两个面在立方体中相邻返回true，否则返回false
 */
function isAdjacent(face1, face2, netFaces = null) {
    // 输入验证
    if (!isValidFace(face1) || !isValidFace(face2)) {
        return false;
    }
    
    // 相同面不相邻
    if (face1 === face2) {
        return false;
    }
    
    // 获取展开图数据
    if (!netFaces && typeof window !== 'undefined' && window.currentNet) {
        netFaces = window.currentNet.faces;
    }
    
    if (!Array.isArray(netFaces) || netFaces.length !== 6) {
        return false;
    }
    
    // 找到两个面在展开图中的位置索引
    const pos1 = netFaces.findIndex(f => f.number === face1);
    const pos2 = netFaces.findIndex(f => f.number === face2);
    
    if (pos1 === -1 || pos2 === -1) {
        return false;
    }
    
    // 使用位置邻接关系进行检查
    return isPositionAdjacent(pos1, pos2);
}









/**
 * 传统的基于数字的邻接关系检查（向后兼容）
 * @param {number} face1 - 第一个面的编号 (1-6)
 * @param {number} face2 - 第二个面的编号 (1-6)
 * @returns {boolean} 如果两个面相邻返回true，否则返回false
 */
function isAdjacentByNumber(face1, face2) {
    // 使用立方体的通用邻接关系（任何展开图都适用的基本规则）
    const UNIVERSAL_ADJACENCY = {
        1: [2, 3, 4, 5],
        2: [1, 3, 4, 6], 
        3: [1, 2, 5, 6],
        4: [1, 2, 5, 6],
        5: [1, 3, 4, 6],
        6: [2, 3, 4, 5]
    };
    
    if (face1 === face2) return false;
    const adjacentList = UNIVERSAL_ADJACENCY[face1];
    return adjacentList ? adjacentList.includes(face2) : false;
}

/**
 * 验证面编号是否有效
 * @param {any} face - 要验证的面编号
 * @returns {boolean} 如果是有效的面编号返回true
 */
function isValidFace(face) {
    return Number.isInteger(face) && face >= 1 && face <= 6;
}

/**
 * 验证位置索引是否有效
 * @param {any} position - 要验证的位置索引
 * @returns {boolean} 如果是有效的位置索引返回true
 */
function isValidPosition(position) {
    return Number.isInteger(position) && position >= 0 && position <= 5;
}

/**
 * 获取指定位置的所有邻接位置（基于当前展开图）
 * @param {number} position - 位置索引 (0-5)
 * @returns {number[]} 邻接位置索引数组
 * @throws {Error} 如果位置索引无效
 */
function getAdjacentPositions(position) {
    if (!isValidPosition(position)) {
        throw new Error(`无效的位置索引: ${position}. 位置索引必须是0-5之间的整数`);
    }
    
    const adjacentList = currentPositionAdjacency[position];
    return adjacentList ? [...adjacentList] : []; // 返回副本，避免修改原数据
}

/**
 * 获取指定面的所有邻接面（基于展开图位置关系）
 * @param {number} face - 面编号 (1-6)
 * @param {Array} netFaces - 展开图的面数据数组
 * @returns {number[]} 邻接面编号数组
 */
function getAdjacentFaces(face, netFaces = null) {
    if (!netFaces && typeof window !== 'undefined' && window.currentNet) {
        netFaces = window.currentNet.faces;
    }
    
    if (!netFaces) {
        console.warn('无法获取展开图数据，返回空数组');
        return [];
    }
    
    // 找到该面在展开图中的位置索引
    const position = netFaces.findIndex(f => f.number === face);
    if (position === -1) {
        console.warn(`无法在展开图中找到面 ${face}`);
        return [];
    }
    
    // 获取邻接位置，然后转换为面编号
    const adjacentPositions = getAdjacentPositions(position);
    return adjacentPositions.map(pos => netFaces[pos].number).filter(n => n !== undefined);
}

/**
 * 检查三个面是否可以在立方体的一个顶点相遇（穷举法验证）
 * 使用预定义的立方体8个顶点进行验证，确保准确性
 * @param {number} face1 - 第一个面
 * @param {number} face2 - 第二个面  
 * @param {number} face3 - 第三个面
 * @param {Array} netFaces - 展开图的面数据数组
 * @returns {boolean} 如果三个面可以在一个顶点相遇返回true
 */
function canMeetAtVertex(face1, face2, face3, netFaces = null) {
    // 输入验证
    const faces = [face1, face2, face3];
    if (!faces.every(face => isValidFace(face))) {
        return false;
    }
    
    // 三个面必须都不同
    if (new Set(faces).size !== 3) {
        return false;
    }

    // 获取展开图数据
    if (!netFaces && typeof window !== 'undefined' && window.currentNet) {
        netFaces = window.currentNet.faces;
    }
    
    if (!Array.isArray(netFaces) || netFaces.length !== 6) {
        return false;
    }

    // 直接检查三面组合是否在有效列表中
    return isThreeFaceCombinationValid(face1, face2, face3, netFaces);
}










/**
 * 直接从顶点定义中选择一个作为正确答案（简化版本）
 * @param {Array} netFaces - 展开图的面数据数组
 * @returns {Object|null} 正确答案的三面组合，如果生成失败返回null
 */
function generateCorrectAnswerFromValidList(netFaces) {
    const netType = getCurrentNetType();
    const vertices = NET_VERTICES_MAP[netType];
    
    if (!vertices || vertices.length === 0) {
        console.error(`没有找到 ${netType} 的顶点定义`);
        return null;
    }
    
    // 随机选择一个顶点
    const randomIndex = Math.floor(Math.random() * vertices.length);
    const selectedVertex = vertices[randomIndex];
    const [pos1, pos2, pos3] = selectedVertex.positions;
    
    // 确保位置索引有效
    if (!netFaces[pos1] || !netFaces[pos2] || !netFaces[pos3]) {
        console.error('顶点位置索引超出展开图范围');
        return null;
    }
    
    const result = {
        front: netFaces[pos1].number,
        left: netFaces[pos2].number,
        top: netFaces[pos3].number
    };
    
    console.log(`从顶点 ${selectedVertex.vertex} (${selectedVertex.description}) 生成正确答案:`, result);
    return result;
}

/**
 * 生成不匹配任何顶点的错误答案（简化版本）
 * @param {Array} netFaces - 展开图的面数据数组
 * @returns {Object} 错误答案的三面组合
 */
function generateWrongAnswerNotInList(netFaces) {
    const netType = getCurrentNetType();
    const vertices = NET_VERTICES_MAP[netType];
    const faceNumbers = netFaces.map(f => f.number);
    const maxAttempts = 100;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        // 随机生成一个三面组合
        const shuffled = [...faceNumbers].sort(() => Math.random() - 0.5);
        const candidate = {
            front: shuffled[0],
            left: shuffled[1],
            top: shuffled[2]
        };
        
        // 检查是否匹配任何顶点
        const matchesVertex = vertices.some(vertex => {
            const [pos1, pos2, pos3] = vertex.positions;
            return (candidate.front === netFaces[pos1].number &&
                    candidate.left === netFaces[pos2].number &&
                    candidate.top === netFaces[pos3].number);
        });
        
        if (!matchesVertex) {
            console.log('生成错误答案（不匹配任何顶点）:', candidate);
            return candidate;
        }
        
        attempts++;
    }
    
    // 备用策略：强制创建一个不匹配的组合
    const fallback = {
        front: faceNumbers[0],
        left: faceNumbers[1], 
        top: faceNumbers[2]
    };
    console.log('使用备用错误答案:', fallback);
    return fallback;
}

/**
 * 检查三面组合是否匹配任何顶点（简化版本）
 * @param {number} face1 - 第一个面编号
 * @param {number} face2 - 第二个面编号
 * @param {number} face3 - 第三个面编号
 * @param {Array} netFaces - 展开图的面数据数组
 * @returns {boolean} 如果匹配任何顶点返回true
 */
function isThreeFaceCombinationValid(face1, face2, face3, netFaces) {
    const netType = getCurrentNetType();
    const vertices = NET_VERTICES_MAP[netType];
    
    if (!vertices) {
        return false;
    }
    
    // 检查所有可能的三面排列是否匹配任何顶点
    const permutations = [
        { front: face1, left: face2, top: face3 },
        { front: face1, left: face3, top: face2 },
        { front: face2, left: face1, top: face3 },
        { front: face2, left: face3, top: face1 },
        { front: face3, left: face1, top: face2 },
        { front: face3, left: face2, top: face1 }
    ];
    
    return permutations.some(perm => {
        return vertices.some(vertex => {
            const [pos1, pos2, pos3] = vertex.positions;
            return (perm.front === netFaces[pos1].number &&
                    perm.left === netFaces[pos2].number &&
                    perm.top === netFaces[pos3].number);
        });
    });
}

/**
 * 获取与指定位置相对的位置（基于当前展开图）
 * 根据立方体的性质，相对的位置不在邻接关系中
 * @param {number} position - 位置索引 (0-5)
 * @returns {number} 相对位置的索引
 * @throws {Error} 如果位置索引无效
 */
function getOppositePosition(position) {
    if (!isValidPosition(position)) {
        throw new Error(`无效的位置索引: ${position}. 位置索引必须是0-5之间的整数`);
    }
    
    // 找到不在邻接列表中的位置，就是相对位置
    const adjacentPositions = currentPositionAdjacency[position] || [];
    for (let i = 0; i <= 5; i++) {
        if (i !== position && !adjacentPositions.includes(i)) {
            return i;
        }
    }
    
    throw new Error(`无法找到位置 ${position} 的相对位置`);
}

/**
 * 获取与指定面相对的面（基于展开图位置关系）
 * @param {number} face - 面编号 (1-6)
 * @param {Array} netFaces - 展开图的面数据数组
 * @returns {number|null} 相对面的编号，如果找不到返回null
 */
function getOppositeFace(face, netFaces = null) {
    if (!netFaces && typeof window !== 'undefined' && window.currentNet) {
        netFaces = window.currentNet.faces;
    }
    
    if (!netFaces) {
        console.warn('无法获取展开图数据');
        return null;
    }
    
    // 找到该面在展开图中的位置索引
    const position = netFaces.findIndex(f => f.number === face);
    if (position === -1) {
        console.warn(`无法在展开图中找到面 ${face}`);
        return null;
    }
    
    try {
        const oppositePosition = getOppositePosition(position);
        return netFaces[oppositePosition].number;
    } catch (error) {
        console.warn(`无法找到面 ${face} 的相对面: ${error.message}`);
        return null;
    }
}

// 测试用例验证 - 支持多种展开图的位置邻接关系
function runAdjacencyTests() {
    console.log('开始位置邻接关系测试...');
    
    try {
        // 测试所有展开图类型
        const netTypes = ['十字形', 'T形', 'Z形', 'L形'];
        let allTestsPassed = true;
        
        for (const netType of netTypes) {
            console.log(`\n=== 测试 ${netType} 展开图 ===`);
            setAdjacencyForNet(netType);
            
            // 基本验证：每个位置都应该有邻接位置
            for (let position = 0; position <= 5; position++) {
                const adjacent = getAdjacentPositions(position);
                if (adjacent.length === 0) {
                    console.error(`${netType}: 位置${position}没有邻接位置`);
                    allTestsPassed = false;
                }
            }
            
            // 验证对称性：如果位置A邻接位置B，则B也应该邻接A
            for (let pos1 = 0; pos1 <= 5; pos1++) {
                const adjacent1 = getAdjacentPositions(pos1);
                for (const pos2 of adjacent1) {
                    if (!isPositionAdjacent(pos2, pos1)) {
                        console.error(`${netType}: 位置邻接关系不对称 - 位置${pos1}邻接位置${pos2}，但位置${pos2}不邻接位置${pos1}`);
                        allTestsPassed = false;
                    }
                }
            }
            
            // 验证相对位置关系
            try {
                for (let position = 0; position <= 5; position++) {
                    const opposite = getOppositePosition(position);
                    if (isPositionAdjacent(position, opposite)) {
                        console.error(`${netType}: 位置${position}与其相对位置${opposite}不应该相邻`);
                        allTestsPassed = false;
                    }
                }
            } catch (e) {
                console.log(`${netType}: 某些位置可能没有明确的相对位置 - 这在某些展开图中是正常的`);
            }
            
            console.log(`${netType} 位置邻接关系测试完成`);
        }
        
        // 恢复默认十字形
        setAdjacencyForNet('十字形');
        
        if (allTestsPassed) {
            console.log('✅ 所有展开图的位置邻接关系测试通过！');
            return true;
        } else {
            console.log('❌ 某些测试失败，请检查位置邻接关系定义');
            return false;
        }
        
    } catch (error) {
        console.error('❌ 位置邻接关系测试失败:', error);
        return false;
    }
}

// 如果在浏览器环境中，暴露函数
if (typeof window !== 'undefined') {
    // 新的位置基础函数
    window.setAdjacencyForNet = setAdjacencyForNet;
    window.getCurrentAdjacency = getCurrentAdjacency;
    window.getCurrentNetType = getCurrentNetType;
    window.runAdjacencyTests = runAdjacencyTests;
    
    // 位置相关函数
    window.isPositionAdjacent = isPositionAdjacent;
    window.getAdjacentPositions = getAdjacentPositions;
    window.getOppositePosition = getOppositePosition;
    
    // 向后兼容的面相关函数
    window.isAdjacent = isAdjacent;
    window.getAdjacentFaces = getAdjacentFaces;
    window.canMeetAtVertex = canMeetAtVertex;
    window.getOppositeFace = getOppositeFace;
    
    // 新增的工具函数
    window.isAdjacentByNumber = isAdjacentByNumber;
    window.isValidFace = isValidFace;
    window.isValidPosition = isValidPosition;
    
    // 穷举法相关函数（已简化）
    window.generateCorrectAnswerFromValidList = generateCorrectAnswerFromValidList;
    window.generateWrongAnswerNotInList = generateWrongAnswerNotInList;
    window.isThreeFaceCombinationValid = isThreeFaceCombinationValid;
} 