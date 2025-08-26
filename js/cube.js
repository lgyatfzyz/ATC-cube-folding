/**
 * 立方体相关函数模块
 * 包含展开图生成、立方体选项生成等功能
 */

// 11种标准立方体展开图模板
// 每个模板定义了6个面在网格中的位置 [row, col, face_number]
const CUBE_NETS = [
    // 1.png - 十字形
    {
        name: '十字形',
        pattern: [
            [0, 1, 1],  // 上
            [1, 0, 2],  // 左
            [1, 1, 3],  // 中心
            [1, 2, 4],  // 右
            [1, 3, 5],  // 最右
            [2, 1, 6]   // 下
        ],
        gridSize: [3, 4]
    },
    // 2.png - T形
    {
        name: 'T形',
        pattern: [
            [0, 1, 1],  // 上
            [1, 0, 2],  // 左中
            [1, 1, 3],  // 中心
            [1, 2, 4],  // 右中
            [1, 3, 5],  // 最右中
            [2, 0, 6]   // 下
        ],
        gridSize: [3, 4]
    },
    // 3.png - T形变体
    {
        name: 'T形变体',
        pattern: [
            [0, 2, 1],  // 上
            [1, 0, 2],  // 左中
            [1, 1, 3],  // 中心
            [1, 2, 4],  // 右中
            [1, 3, 5],  // 最右中
            [2, 1, 6]   // 下
        ],
        gridSize: [3, 4]
    },
    // 4.png - L形变体1
    {
        name: 'L形变体1',
        pattern: [
            [0, 3, 1],  // 左上
            [1, 0, 2],  // 中上
            [1, 1, 3],  // 右上
            [1, 2, 4],  // 最右上
            [1, 3, 5],  // 左下
            [2, 0, 6]   // 底左
        ],
        gridSize: [3, 4]
    },
    // 5.png - L形变体2
    {
        name: 'L形变体2',
        pattern: [
            [0, 3, 1],  // 右上
            [1, 0, 2],  // 左中
            [1, 1, 3],  // 左中右
            [1, 2, 4],  // 右中
            [1, 3, 5],  // 最右中
            [2, 1, 6]   // 下左
        ],
        gridSize: [3, 4]
    },
    // 6.png - Z形变体
    {
        name: 'Z形变体',
        pattern: [
            [0, 0, 1],  // 左上
            [0, 1, 2],  // 中上
            [0, 2, 3],  // 右上
            [1, 2, 4],  // 右中
            [1, 3, 5],  // 右右中
            [1, 4, 6]   // 最右中
        ],
        gridSize: [2, 5]
    },
    // 7.png - 特殊形状
    {
        name: '特殊形状',
        pattern: [
            [0, 0, 1],  // 左上
            [0, 1, 2],  // 右上
            [1, 1, 3],  // 右中
            [1, 2, 4],  // 右右中
            [1, 3, 5],  // 最右中
            [2, 2, 6]   // 右下
        ],
        gridSize: [3, 4]
    },
    // 8.png - Z形
    {
        name: 'Z形',
        pattern: [
            [0, 0, 1],  // 左上
            [0, 1, 2],  // 右上
            [1, 1, 3],  // 右中
            [1, 2, 4],  // 右右中
            [1, 3, 5],  // 右下右
            [2, 3, 6]   // 最右下
        ],
        gridSize: [3, 4]
    },
    // 9.png - 另一种特殊形状
    {
        name: '另一种特殊形状',
        pattern: [
            [0, 2, 1],  // 中上
            [1, 0, 2],  // 左中
            [1, 1, 3],  // 中心
            [1, 2, 4],  // 右中
            [2, 2, 5],  // 下中
            [2, 3, 6]   // 下右
        ],
        gridSize: [3, 4]
    },
    // 10.png - L形
    {
        name: 'L形',
        pattern: [
            [0, 0, 1],  // 上方中心
            [1, 0, 2],  // 中间最左
            [1, 1, 3],  // 中间左中
            [1, 2, 4],  // 中间右中
            [1, 3, 5],  // 中间最右
            [2, 0, 6]   // 下方左对齐
        ],
        gridSize: [3, 4]
    },
    // 11.png - 阶梯形变体
    {
        name: '阶梯形变体',
        pattern: [
            [0, 0, 1],  // 左上
            [0, 1, 2],  // 右上
            [1, 1, 3],  // 右中
            [1, 2, 4],  // 右右中
            [2, 2, 5],  // 右下中
            [2, 3, 6]   // 右下右
        ],
        gridSize: [3, 4]
    }
];

/**
 * 随机生成一个立方体展开图
 * @returns {Object} 包含展开图信息的对象
 */
function generateRandomNet() {
    // 随机选择一种展开图模板
    const template = CUBE_NETS[Math.floor(Math.random() * CUBE_NETS.length)];
    
    // 随机打乱面的编号 (1-6)
    const faceNumbers = shuffleArray([1, 2, 3, 4, 5, 6]);
    
    // 创建展开图数据
    const net = {
        name: template.name,
        gridSize: template.gridSize,
        faces: template.pattern.map((position, index) => ({
            row: position[0],
            col: position[1],
            number: faceNumbers[index]
        }))
    };
    
    // 设置对应的位置邻接关系
    if (typeof setAdjacencyForNet === 'function') {
        setAdjacencyForNet(net.name);
    }
    
    // 设置全局当前展开图（供 adjacency.js 使用）
    if (typeof window !== 'undefined') {
        window.currentNet = net;
    }
    
    return net;
}

/**
 * 打乱数组顺序
 * @param {Array} array - 要打乱的数组
 * @returns {Array} 打乱后的新数组
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * 生成立方体的四个选项（1个正确，3个错误）
 * @param {Object} net - 展开图对象
 * @returns {Array} 包含四个立方体选项的数组
 */
function generateCubeOptions(net) {
    
    // 重要：根据展开图类型设置对应的邻接关系
    if (typeof setAdjacencyForNet === 'function') {
        setAdjacencyForNet(net.name);
        console.log(`为 ${net.name} 展开图设置邻接关系`);
    } else {
        console.warn('setAdjacencyForNet 函数未找到，使用默认邻接关系');
    }
    
    const cubeOptions = [];
    
    // 生成正确选项（始终使用三面显示，但可以用六面验证生成）
    const correctOption = generateCorrectCube(net);
    cubeOptions.push({
        faces: correctOption,
        isCorrect: true,
        id: 'option-0'
    });
    
    // 生成3个错误选项
    for (let i = 1; i <= 3; i++) {
        const wrongOption = generateWrongCube(net, cubeOptions);
        
        cubeOptions.push({
            faces: wrongOption,
            isCorrect: false,
            id: `option-${i}`
        });
    }
    
    // 确保答案唯一性
    let finalOptions = ensureUniqueCorrectAnswer(shuffleArray(cubeOptions));

    // 自动修复：如果存在错误选项与正确三面一致，或错误选项通过三面几何校验，则重生该错误项
    const netFaces = net.faces;
    const correct = finalOptions.find(o => o.isCorrect);
    const correctThree = correct ? { front: correct.faces.front, left: correct.faces.left, top: correct.faces.top } : null;
    const isThreeValid = tri => {
        return (typeof canMeetAtVertex === 'function')
            ? canMeetAtVertex(tri.front, tri.left, tri.top, netFaces)
            : (isAdjacent(tri.front, tri.left, netFaces) && isAdjacent(tri.left, tri.top, netFaces) && isAdjacent(tri.front, tri.top, netFaces));
    };

    if (correctThree) {
        for (let i = 0; i < finalOptions.length; i++) {
            const opt = finalOptions[i];
            if (opt.isCorrect) continue;
            let tri = { front: opt.faces.front, left: opt.faces.left, top: opt.faces.top };
            let guard = 0;
            while (
                guard < 100 && (
                    (tri.front === correctThree.front && tri.left === correctThree.left && tri.top === correctThree.top) ||
                    isThreeValid(tri)
                )
            ) {
                // 重生错误项
                const newWrong = generateWrongCube(net, finalOptions);
                opt.faces = newWrong;
                tri = { front: opt.faces.front, left: opt.faces.left, top: opt.faces.top };
                guard++;
            }
        }
    }

    return finalOptions;
}


/**
 * 根据展开图生成正确的立方体
 * @param {Object} net - 展开图对象
 * @returns {Object} 立方体的三个可见面
 */
function generateCorrectCube(net) {
    console.log('生成正确立方体，展开图面:', net.faces.map(f => f.number));
    
    // 使用穷举法生成正确答案
    if (typeof generateCorrectAnswerFromValidList === 'function') {
        const correctAnswer = generateCorrectAnswerFromValidList(net.faces);
        if (correctAnswer) {
            console.log('穷举法生成正确解:', correctAnswer);
            return correctAnswer;
        }
        console.warn('穷举法生成失败，尝试备用策略');
    }
    
    // 备用策略：从展开图中提取面的编号（保持原始顺序，避免补齐非法数据）
    const availableFaces = net.faces.map(face => face.number);
    
    // 针对特定展开图（如 Z形）优先采用基于“位置三元组”的安全策略，避免对立面被误判为相邻
    if (net && net.name === 'Z形') {
        // 按模板索引的安全顶点三元组（连续窗口）
        const safeTriples = [
            [0, 1, 2],
            [1, 2, 3],
            [2, 3, 4],
            [3, 4, 5]
        ];
        const shuffledTriples = shuffleArray(safeTriples);
        for (const triple of shuffledTriples) {
            const [p1, p2, p3] = triple;
            const candidate = {
                front: net.faces[p1].number,
                left: net.faces[p2].number,
                top: net.faces[p3].number
            };
            if (isValidCubeFaces(candidate, net)) {
                console.log('Z形采用位置安全三元组生成正确解:', triple, candidate);
                return candidate;
            }
        }
        // 若上述策略未找到，则继续通用策略
    }

    // 通用优先策略：直接从网格推导所有“顶点三元组”，优先使用
    const netFaces = net.faces;
    if (Array.isArray(netFaces) && typeof canMeetAtVertex === 'function') {
        const nums = netFaces.map(f => f.number);
        const candidates = [];
        for (let i = 0; i < nums.length; i++) {
            for (let j = 0; j < nums.length; j++) {
                for (let k = 0; k < nums.length; k++) {
                    if (new Set([nums[i], nums[j], nums[k]]).size !== 3) continue;
                    if (canMeetAtVertex(nums[i], nums[j], nums[k], netFaces)) {
                        candidates.push({ front: nums[i], left: nums[j], top: nums[k] });
                    }
                }
            }
        }
        if (candidates.length > 0) {
            const chosen = candidates[Math.floor(Math.random() * candidates.length)];
            const oriented = orientTripleForDisplay(chosen, net.faces);
            if (isValidCubeFaces(oriented, net)) {
                return oriented;
            }
        }
    }

    // 回退策略：尝试找到三个能在同一顶点相遇的面
    let result = null;
    let attempts = 0;
    const maxAttempts = 50;
    
    while (!result && attempts < maxAttempts) {
        const shuffledFaces = shuffleArray([...availableFaces]);
        const candidate = {
            front: shuffledFaces[0],
            left: shuffledFaces[1],
            top: shuffledFaces[2]
        };
        
        // 确保三个面都不相同
        if (candidate.front !== candidate.left && 
            candidate.left !== candidate.top && 
            candidate.front !== candidate.top) {
            
            // 采用顶点相遇与完整校验双重判断
            const netFaces = net.faces;
            const meet = (typeof canMeetAtVertex === 'function') ? canMeetAtVertex(candidate.front, candidate.left, candidate.top, netFaces) : true;
            if (meet && isValidCubeFaces(candidate, net)) {
                result = orientTripleForDisplay(candidate, netFaces);
                break; // 找到符合条件的组合就退出
            }
        }
        attempts++;
    }
    
    // 如果仍然没有找到合适的组合，尝试更系统的方法
    if (!result) {
        console.warn(`在${maxAttempts}次随机尝试中未找到有效组合，尝试穷举法`);
        result = findValidCombinationExhaustive(net);
        
        if (!result) {
            console.error('穷举法也未找到有效组合，无法生成有效的正确答案');
            throw new Error('无法生成有效的正确答案');
        }
    }
    
    console.log('生成的正确立方体面:', result);
    
    // 最终验证生成的正确答案
    if (!isValidCubeFaces(result, net)) {
        console.error('警告：生成的"正确"答案实际上不满足邻接关系！');
    }
    
    return result;
}

/**
 * 根据展开图位置为三面组合确定显示方向（front/left/top）
 * 规则：选取“枢轴面”（与另外两面都相邻且正交）。将枢轴面作为 left；
 * 优先把位于枢轴面下方的邻面作为 front，否则优先枢轴面左侧作为 front；
 * 剩余另一个邻面作为 top。
 */
function orientTripleForDisplay(triple, netFaces) {
    if (!Array.isArray(netFaces)) return triple;
    const nums = [triple.front, triple.left, triple.top];
    const info = n => netFaces.find(f => f.number === n);
    const p = nums.map(n => ({ n, f: info(n) })).filter(x => x.f);
    if (p.length !== 3) return triple;

    // 找到枢轴面：与其他两面均为曼哈顿距离1
    const manhattan = (a, b) => Math.abs(a.f.row - b.f.row) + Math.abs(a.f.col - b.f.col);
    let pivot = null, others = [];
    for (let i = 0; i < 3; i++) {
        const a = p[i], b = p[(i+1)%3], c = p[(i+2)%3];
        if (manhattan(a,b) === 1 && manhattan(a,c) === 1) {
            pivot = a; others = [b, c]; break;
        }
    }
    if (!pivot) return triple;

    const vec = (from, to) => ({ dx: to.f.row - from.f.row, dy: to.f.col - from.f.col });
    const v1 = vec(pivot, others[0]);
    const v2 = vec(pivot, others[1]);

    // 选择front的优先级：下方(1,0) > 左侧(0,-1) > 上方(-1,0) > 右侧(0,1)
    const score = v => (v.dx === 1 && v.dy === 0) ? 4 : (v.dx === 0 && v.dy === -1) ? 3 : (v.dx === -1 && v.dy === 0) ? 2 : (v.dx === 0 && v.dy === 1) ? 1 : 0;
    const chooseFrontFrom = (o1, o2) => (score(vec(pivot,o1)) >= score(vec(pivot,o2)) ? o1 : o2);
    const frontNode = chooseFrontFrom(others[0], others[1]);
    const topNode = (frontNode === others[0]) ? others[1] : others[0];

    return { front: frontNode.n, left: pivot.n, top: topNode.n };
}

/**
 * 使用穷举法找到有效的立方体面组合
 * @param {Object} net - 展开图对象
 * @returns {Object|null} 有效的面组合或null
 */
function findValidCombinationExhaustive(net) {
    const availableFaces = net.faces.map(face => face.number);
    
    // 穷举所有可能的三面组合
    for (let i = 0; i < availableFaces.length; i++) {
        for (let j = 0; j < availableFaces.length; j++) {
            for (let k = 0; k < availableFaces.length; k++) {
                // 确保三个面不同
                if (i !== j && j !== k && i !== k) {
                    const candidate = {
                        front: availableFaces[i],
                        left: availableFaces[j],
                        top: availableFaces[k]
                    };
                    
                    if (isValidCubeFaces(candidate, net)) {
                        console.log('穷举法找到有效组合:', candidate);
                        return candidate;
                    }
                }
            }
        }
    }
    
    return null;
}

/**
 * 生成错误的立方体选项
 * @param {Object} net - 展开图对象
 * @param {Array} existingOptions - 已有的选项
 * @returns {Object} 错误的立方体面配置
 */
function generateWrongCube(net, existingOptions) {
    return generateReliableWrongOption(net, existingOptions);
}

/**
 * 生成可靠的错误选项（确保与正确答案不同且违反规则）
 * @param {Object} net - 展开图对象
 * @param {Array} existingOptions - 已有的选项
 * @returns {Object} 错误的三面立方体配置
 */
function generateReliableWrongOption(net, existingOptions) {
    if (!net || !net.faces || net.faces.length !== 6) {
        console.error('无效的展开图数据');
        return { front: 1, left: 2, top: 3 }; // 返回默认错误选项
    }
    
    // 使用简化的顶点匹配法生成错误答案
    if (typeof generateWrongAnswerNotInList === 'function') {
        const wrongAnswer = generateWrongAnswerNotInList(net.faces);
        if (wrongAnswer) {
            console.log('顶点匹配法生成错误答案:', wrongAnswer);
            return wrongAnswer;
        }
        console.warn('顶点匹配法生成错误答案失败，尝试备用策略');
    }
    
    // 备用策略：传统方法
    const availableFaces = net.faces.map(face => face.number);
    const strategies = [
        () => generateViolatingAdjacentRule(net, existingOptions),
        () => generateDuplicateFaceOption(availableFaces),
        () => generateNonVertexOption(net, existingOptions),
        () => generateRandomWrongOption(availableFaces)
    ];
    
    // 尝试不同策略生成错误选项
    for (const strategy of strategies) {
        try {
            const wrongOption = strategy();
            if (wrongOption && isValidWrongOption(wrongOption, net, existingOptions)) {
                return wrongOption;
            }
        } catch (error) {
            console.warn('生成策略失败:', error.message);
            continue;
        }
    }
    
    // 最终后备方案：确保生成一个不同的选项
    return generateFallbackWrongOption(availableFaces, existingOptions);
}

/**
 * 策略1：生成违反邻接规则的选项
 */
function generateViolatingAdjacentRule(net, existingOptions) {
    const faces = net.faces.map(f => f.number);
    
    // 寻找两个不相邻的面
    for (let i = 0; i < faces.length; i++) {
        for (let j = i + 1; j < faces.length; j++) {
            if (!isAdjacent(faces[i], faces[j], net.faces)) {
                // 找到了不相邻的两个面，构造错误选项
                const remainingFaces = faces.filter(f => f !== faces[i] && f !== faces[j]);
                if (remainingFaces.length > 0) {
                    return {
                        front: faces[i],
                        left: faces[j],
                        top: remainingFaces[0]
                    };
                }
            }
        }
    }
    
    return null;
}

/**
 * 策略2：生成包含重复面的选项
 */
function generateDuplicateFaceOption(availableFaces) {
    if (availableFaces.length < 2) return null;
    
    return {
        front: availableFaces[0],
        left: availableFaces[0], // 故意重复
        top: availableFaces[1]
    };
}

/**
 * 策略3：生成无法在顶点相遇的三面组合
 */
function generateNonVertexOption(net, existingOptions) {
    const faces = net.faces.map(f => f.number);
    
    // 尝试找到无法在顶点相遇的三面组合
    for (let i = 0; i < faces.length; i++) {
        for (let j = i + 1; j < faces.length; j++) {
            for (let k = j + 1; k < faces.length; k++) {
                const candidate = {
                    front: faces[i],
                    left: faces[j],
                    top: faces[k]
                };
                
                if (!canMeetAtVertex(faces[i], faces[j], faces[k], net.faces)) {
                    return candidate;
                }
            }
        }
    }
    
    return null;
}

/**
 * 策略4：随机生成错误选项
 */
function generateRandomWrongOption(availableFaces) {
    const shuffled = shuffleArray([...availableFaces]);
    return {
        front: shuffled[0] || 1,
        left: shuffled[1] || 2,
        top: shuffled[2] || 3
    };
}

/**
 * 验证错误选项是否有效（确保它确实是错误的且唯一）
 */
function isValidWrongOption(option, net, existingOptions) {
    // 检查是否真的是错误的
    if (isValidCubeFaces(option, net)) {
        return false; // 如果是有效配置，则不是合适的错误选项
    }
    
    // 检查是否与已有选项重复
    for (const existing of existingOptions) {
        if (existing.faces.front === option.front && 
            existing.faces.left === option.left && 
            existing.faces.top === option.top) {
            return false;
        }
    }
    
    return true;
}

/**
 * 后备错误选项生成
 */
function generateFallbackWrongOption(availableFaces, existingOptions) {
    // 简单策略：打乱面的顺序
    const shuffled = shuffleArray([...availableFaces]);
    
    let attempt = 0;
    while (attempt < availableFaces.length) {
        const option = {
            front: shuffled[(attempt) % availableFaces.length] || 1,
            left: shuffled[(attempt + 1) % availableFaces.length] || 2,
            top: shuffled[(attempt + 2) % availableFaces.length] || 3
        };
        
        // 确保三个面不同
        if (option.front !== option.left && option.left !== option.top && option.front !== option.top) {
            // 检查是否与已有选项重复
            const isDuplicate = existingOptions.some(existing => 
                existing.faces.front === option.front && 
                existing.faces.left === option.left && 
                existing.faces.top === option.top
            );
            
            if (!isDuplicate) {
                return option;
            }
        }
        
        attempt++;
    }
    
    // 最终保险措施
    return { front: 1, left: 2, top: 3 };
}






/**
 * 检查立方体面配置是否有效（简化版本）
 * @param {Object} faces - 包含面配置的对象
 * @param {Object} net - 展开图对象（可选）
 * @returns {boolean} 如果面配置有效返回true
 */
function isValidCubeFaces(faces, net = null) {
    // 检查输入参数
    if (!faces || typeof faces !== 'object') {
        return false;
    }
    
    // 获取展开图数据
    if (!net && typeof window !== 'undefined' && window.currentNet) {
        net = window.currentNet;
    }
    
    // 只处理三面配置
    return isValidThreeFaceConfiguration(faces, net);
}

/**
 * 验证三面立方体配置
 * @param {Object} faces - 包含front, left, top的面配置
 * @param {Object} net - 展开图对象
 * @returns {boolean} 如果配置有效返回true
 */
function isValidThreeFaceConfiguration(faces, net) {
    const { front, left, top } = faces;
    
    // 基础验证
    if (!isValidFace(front) || !isValidFace(left) || !isValidFace(top)) {
        return false;
    }
    
    // 三个面必须不同
    if (front === left || left === top || front === top) {
        return false;
    }
    
    // 如果没有展开图数据，无法验证
    if (!net || !net.faces) {
        console.warn('缺少展开图数据，无法验证面配置');
        return false;
    }
    
    // 检查三个面是否都在展开图中
    const netNumbers = net.faces.map(f => f.number);
    if (!netNumbers.includes(front) || !netNumbers.includes(left) || !netNumbers.includes(top)) {
        return false;
    }
    
    // 使用顶点相遇检查
    return canMeetAtVertex(front, left, top, net.faces);
}













/**
 * 渲染展开图到DOM（增强错误处理）
 * @param {Object} net - 展开图对象
 * @param {string} containerId - 容器元素ID
 * @returns {boolean} 渲染成功返回true，失败返回false
 */
function renderNet(net, containerId) {
    try {
        // 输入验证
        if (!net || !net.faces || !net.gridSize) {
            console.error('展开图数据无效');
            return false;
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`未找到容器元素: ${containerId}`);
            return false;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        // 创建网格容器
        const grid = document.createElement('div');
        grid.className = 'net-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateRows = `repeat(${net.gridSize[0]}, 60px)`;
        grid.style.gridTemplateColumns = `repeat(${net.gridSize[1]}, 60px)`;
        grid.style.gap = '2px';
        
        // 创建网格单元
        const totalCells = net.gridSize[0] * net.gridSize[1];
        if (totalCells <= 0 || totalCells > 100) { // 防止过大网格
            console.error(`网格大小异常: ${totalCells}`);
            return false;
        }
        
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'net-cell empty';
            grid.appendChild(cell);
        }
        
        // 填充面的数据
        let filledCount = 0;
        net.faces.forEach(face => {
            if (!face || typeof face.row !== 'number' || typeof face.col !== 'number' || !face.number) {
                console.warn('无效的面数据:', face);
                return;
            }
            
            const cellIndex = face.row * net.gridSize[1] + face.col;
            if (cellIndex >= 0 && cellIndex < grid.children.length) {
                const cell = grid.children[cellIndex];
                if (cell) {
                    cell.className = `net-cell filled face-${face.number}`;
                    cell.textContent = face.number;
                    cell.setAttribute('data-face', face.number);
                    filledCount++;
                }
            }
        });
        
        if (filledCount !== 6) {
            console.warn(`预期6个面，实际渲染${filledCount}个`);
        }
        
        container.appendChild(grid);
        return true;
        
    } catch (error) {
        console.error('渲染展开图时发生错误:', error);
        return false;
    }
}

/**
 * 确保面数据有效且唯一
 * @param {Object} faces - 包含front, left, top面数据的对象
 * @param {number} optionIndex - 选项索引，用于日志
 * @returns {Object} 处理后的面数据对象
 */
function ensureValidUniqueFaces(faces, optionIndex = 0) {
    // 默认安全面数据
    const safeFaces = { front: 1, left: 2, top: 3 };
    
    try {
        // 检查输入数据是否有效
        if (!faces || typeof faces !== 'object') {
            console.warn(`选项 ${optionIndex}: 面数据无效，使用默认值`);
            return safeFaces;
        }
        
        // 提取并验证三个面的数据
        const front = parseInt(faces.front) || 1;
        const left = parseInt(faces.left) || 2;
        const top = parseInt(faces.top) || 3;
        
        // 确保所有面都在1-6范围内
        const validFront = Math.max(1, Math.min(6, front));
        const validLeft = Math.max(1, Math.min(6, left));
        const validTop = Math.max(1, Math.min(6, top));
        
        // 创建候选面数组（排除已使用的面）
        const usedFaces = new Set();
        const resultFaces = { front: validFront, left: validLeft, top: validTop };
        
        // 检查并修复重复面
        if (validFront === validLeft || validLeft === validTop || validFront === validTop) {
            console.warn(`选项 ${optionIndex}: 发现重复面 (${validFront}, ${validLeft}, ${validTop})，正在修复`);
            
            // 重新分配唯一面
            const availableFaces = [1, 2, 3, 4, 5, 6];
            let assignedFaces = [];
            
            // 优先保持front面
            assignedFaces.push(validFront);
            usedFaces.add(validFront);
            
            // 为left面分配不同的值
            let newLeft = validLeft;
            if (usedFaces.has(newLeft)) {
                newLeft = availableFaces.find(f => !usedFaces.has(f)) || 2;
            }
            assignedFaces.push(newLeft);
            usedFaces.add(newLeft);
            
            // 为top面分配不同的值
            let newTop = validTop;
            if (usedFaces.has(newTop)) {
                newTop = availableFaces.find(f => !usedFaces.has(f)) || 3;
            }
            assignedFaces.push(newTop);
            
            resultFaces.front = assignedFaces[0];
            resultFaces.left = assignedFaces[1];
            resultFaces.top = assignedFaces[2];
            
            console.log(`选项 ${optionIndex}: 修复后的面 (${resultFaces.front}, ${resultFaces.left}, ${resultFaces.top})`);
        }
        
        return resultFaces;
        
    } catch (error) {
        console.error(`选项 ${optionIndex}: 处理面数据时发生错误:`, error);
        return safeFaces;
    }
}

/**
 * 渲染立方体选项到DOM（增强错误处理）
 * @param {Array} options - 立方体选项数组
 * @param {string} containerId - 容器元素ID
 * @returns {boolean} 渲染成功返回true，失败返回false
 */
function renderCubeOptions(options, containerId) {
    try {
        // 输入验证
        if (!Array.isArray(options) || options.length === 0) {
            console.error('立方体选项数据无效');
            return false;
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`未找到容器元素: ${containerId}`);
            return false;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        let renderCount = 0;
        
        options.forEach((option, index) => {
            if (!option || !option.faces) {
                console.warn(`选项 ${index} 数据无效:`, option);
                return;
            }
            
            const cubeDiv = document.createElement('div');
            cubeDiv.className = 'cube-option';
            cubeDiv.setAttribute('data-option-id', option.id || `option-${index}`);
            cubeDiv.setAttribute('data-correct', option.isCorrect || false);
            
            // 创建立方体的三个可见面
            const faces = option.faces;
            
            // 确保所有面都有有效值且不重复
            const safeFaces = ensureValidUniqueFaces(faces, index);
            
            try {
                cubeDiv.innerHTML = `
                    <div class="cube-3d">
                        <div class="cube-container">
                            <div class="cube-face front" data-face="${safeFaces.front}">${safeFaces.front}</div>
                            <div class="cube-face left" data-face="${safeFaces.left}">${safeFaces.left}</div>
                            <div class="cube-face top" data-face="${safeFaces.top}">${safeFaces.top}</div>
                        </div>
                    </div>
                    <div class="option-label">选项 ${String.fromCharCode(65 + index)}</div>
                `;
                
                // 添加点击事件
                cubeDiv.addEventListener('click', () => handleOptionClick(option, cubeDiv));
                
                container.appendChild(cubeDiv);
                renderCount++;
                
            } catch (domError) {
                console.error(`渲染选项 ${index} 时发生错误:`, domError);
            }
        });
        
        if (renderCount === 0) {
            console.error('没有成功渲染任何选项');
            return false;
        }
        
        console.log(`成功渲染 ${renderCount}/${options.length} 个选项`);
        return true;
        
    } catch (error) {
        console.error('渲染立方体选项时发生错误:', error);
        return false;
    }
}

/**
 * 检查面编号是否有效
 * @param {any} face - 面编号
 * @returns {boolean} 有效返回true
 */
function isValidFaceNumber(face) {
    return typeof face === 'number' && face >= 1 && face <= 6;
}

/**
 * 处理选项点击事件
 * @param {Object} option - 被点击的选项
 * @param {HTMLElement} element - 被点击的DOM元素
 */
function handleOptionClick(option, element) {
    // 移除所有选项的选中状态
    document.querySelectorAll('.cube-option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'wrong');
    });
    
    // 标记当前选项为选中
    element.classList.add('selected');
    
    // 显示反馈
    showFeedback(option.isCorrect, element);
    
    // 禁用所有选项
    document.querySelectorAll('.cube-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    // 显示"下一题"按钮
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.style.display = 'block';
    }
}

/**
 * 显示答案反馈
 * @param {boolean} isCorrect - 答案是否正确
 * @param {HTMLElement} selectedElement - 被选中的元素
 */
function showFeedback(isCorrect, selectedElement) {
    const feedbackSection = document.getElementById('feedbackSection');
    if (!feedbackSection) return;
    
    if (isCorrect) {
        selectedElement.classList.add('correct');
        feedbackSection.innerHTML = `
            <div class="feedback correct">
                <div class="feedback-icon">✅</div>
                <div class="feedback-text">回答正确！</div>
            </div>
        `;
    } else {
        selectedElement.classList.add('wrong');
        // 高亮正确答案
        const correctOption = document.querySelector('.cube-option[data-correct="true"]');
        if (correctOption) {
            correctOption.classList.add('correct');
        }
        
        feedbackSection.innerHTML = `
            <div class="feedback wrong">
                <div class="feedback-icon">❌</div>
                <div class="feedback-text">回答错误，正确答案已高亮显示。</div>
            </div>
        `;
    }
}

/**
 * 确保选项中只有一个正确答案
 * @param {Array} options - 立方体选项数组
 * @returns {Array} 处理后的选项数组，确保只有一个正确答案
 */
function ensureUniqueCorrectAnswer(options) {
    console.log('检查答案唯一性...');
    
    // 找出所有标记为正确的选项
    const correctOptions = options.filter(option => option.isCorrect);
    
    if (correctOptions.length === 0) {
        console.warn('没有找到正确答案，保持原状');
        return options;
    }
    
    if (correctOptions.length === 1) {
        // 验证这个正确答案是否几何有效（传入net参数）
        const net = (typeof window !== 'undefined' && window.currentNet) ? window.currentNet : null;
        const isValid = isValidCubeFaces(correctOptions[0].faces, net);
        if (isValid) {
            console.log('答案唯一且有效');
            return options;
        } else {
            console.error('唯一正确答案不符合几何规律！强制保留但记录错误');
            // 不要返回空，而是继续处理以确保有一个答案
        }
    }
    
    if (correctOptions.length > 1) {
        console.warn(`发现${correctOptions.length}个正确答案，进行唯一性处理`);
        
        // 找出几何有效的正确答案（传入net参数）
        const net = (typeof window !== 'undefined' && window.currentNet) ? window.currentNet : null;
        const validCorrectOptions = correctOptions.filter(option => 
            isValidCubeFaces(option.faces, net)
        );
        
        if (validCorrectOptions.length === 0) {
            console.error('所有正确答案都不符合几何规律，尝试重新生成');
            
            // 尝试为第一个选项重新生成有效的面组合
            if (net) {
                const newValidOption = findValidCombinationExhaustive(net);
                if (newValidOption) {
                    options[0].faces = newValidOption;
                    options[0].isCorrect = true;
                    // 其他选项标记为错误
                    for (let i = 1; i < options.length; i++) {
                        options[i].isCorrect = false;
                    }
                    console.log('重新生成了有效的正确答案');
                } else {
                    console.error('无法重新生成有效答案，保持原状');
                    // 保持第一个作为正确答案，其他标记为错误
                    options.forEach((option, index) => {
                        option.isCorrect = (index === 0);
                    });
                }
            } else {
                // 没有net信息，保持第一个作为正确答案
                options.forEach((option, index) => {
                    option.isCorrect = (index === 0);
                });
            }
        } else if (validCorrectOptions.length === 1) {
            console.log('找到唯一几何有效的正确答案');
            // 只保留一个几何有效的正确答案
            options.forEach(option => {
                option.isCorrect = (option === validCorrectOptions[0]);
            });
        } else {
            console.warn(`有${validCorrectOptions.length}个几何有效的正确答案，选择第一个`);
            // 只保留第一个几何有效的正确答案
            const chosenCorrect = validCorrectOptions[0];
            options.forEach(option => {
                option.isCorrect = (option === chosenCorrect);
            });
        }
    }
    
    // 最终验证：确保只有一个正确答案，并对错误选项做终检
    const net = (typeof window !== 'undefined' && window.currentNet) ? window.currentNet : null;
    const netFaces = net ? net.faces : null;

    // 统一三面投影
    const threeOf = faces => ({ front: faces.front, left: faces.left, top: faces.top });
    const isThreeValid = faces => {
        if (!netFaces) return false;
        return (typeof canMeetAtVertex === 'function')
            ? canMeetAtVertex(faces.front, faces.left, faces.top, netFaces)
            : (isAdjacent(faces.front, faces.left, netFaces) && isAdjacent(faces.left, faces.top, netFaces) && isAdjacent(faces.front, faces.top, netFaces));
    };

    // 计算正确答案三面
    const correct = options.find(o => o.isCorrect);
    const correctThree = correct ? threeOf(correct.faces) : null;

    // 对错误选项做两项检查：
    // 1) 三面不应通过位置几何校验；2) 三面不得与正确答案三面一致
    options.forEach((opt, idx) => {
        if (!opt.isCorrect) {
            const tri = threeOf(opt.faces);
            if (correctThree && tri.front === correctThree.front && tri.left === correctThree.left && tri.top === correctThree.top) {
                // 如果重复，强制标记为需要重生（此处仅日志提示，实际重生应在生成阶段循环保障）
                console.warn(`错误选项 ${idx} 与正确答案三面相同，建议在生成阶段重生该选项`);
            }
            if (isThreeValid(tri)) {
                console.warn(`错误选项 ${idx} 的三面通过了几何校验，建议在生成阶段重生该选项`);
            }
        }
    });

    const finalCorrectCount = options.filter(option => option.isCorrect).length;
    console.log(`最终正确答案数量: ${finalCorrectCount}`);
    return options;
}