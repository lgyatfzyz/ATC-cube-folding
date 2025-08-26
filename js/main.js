/**
 * 主游戏逻辑模块
 * 控制游戏流程、初始化和交互
 */

// 游戏状态
let currentGame = {
    net: null,
    options: null,
    questionNumber: 1
};


/**
 * 初始化游戏（增强错误处理）
 */
function initGame() {
    console.log('初始化立方体折叠游戏...');
    
    try {
        // 步骤1：检查必需的DOM元素
        const requiredElements = ['netContainer', 'optionsGrid', 'feedbackSection', 'nextQuestionBtn'];
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            throw new Error(`缺少必需的DOM元素: ${missingElements.join(', ')}`);
        }
        
        // 步骤2：检查必需的函数
        const requiredFunctions = ['generateRandomNet', 'generateCubeOptions', 'renderNet', 'renderCubeOptions'];
        const missingFunctions = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
        
        if (missingFunctions.length > 0) {
            throw new Error(`缺少必需的函数: ${missingFunctions.join(', ')}`);
        }
        
        // 步骤3：运行邻接关系测试（已简化，跳过）
        console.log('跳过复杂的邻接关系测试，使用简化系统');
        
        // 步骤4：绑定事件监听器
        bindEventListeners();
        
        // 步骤5：开始第一题
        startNewQuestion();
        
        console.log('游戏初始化完成');
        
    } catch (error) {
        console.error('游戏初始化失败:', error);
        showError('游戏初始化失败。请检查浏览器控制台获取更多信息。', error);
        
        // 在初始化失败时提供重新加载选项
        const feedbackSection = document.getElementById('feedbackSection');
        if (feedbackSection) {
            const reloadButton = document.createElement('button');
            reloadButton.textContent = '重新加载页面';
            reloadButton.className = 'next-question-btn';
            reloadButton.style.marginTop = '16px';
            reloadButton.onclick = () => window.location.reload();
            
            const errorDiv = feedbackSection.querySelector('.feedback.error');
            if (errorDiv) {
                errorDiv.appendChild(reloadButton);
            }
        }
    }
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 下一题按钮
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', startNewQuestion);
    }
    
    // 键盘事件 (可选功能)
    document.addEventListener('keydown', handleKeyPress);
}


/**
 * 处理键盘按键事件
 * @param {KeyboardEvent} event - 键盘事件
 */
function handleKeyPress(event) {
    // ESC键重新开始游戏
    if (event.key === 'Escape') {
        startNewQuestion();
    }
    
    // 数字键1-4选择选项
    const keyNum = parseInt(event.key);
    if (keyNum >= 1 && keyNum <= 4) {
        const options = document.querySelectorAll('.cube-option');
        if (options[keyNum - 1] && !options[keyNum - 1].classList.contains('selected')) {
            options[keyNum - 1].click();
        }
    }
}

/**
 * 开始新题目（增强错误处理）
 */
function startNewQuestion() {
    console.log(`开始第 ${currentGame.questionNumber} 题`);
    
    // 清除之前的状态
    clearPreviousState();
    
    try {
        // 步骤1：生成新的展开图
        currentGame.net = generateRandomNet();
        if (!currentGame.net || !currentGame.net.faces || currentGame.net.faces.length !== 6) {
            throw new Error('展开图生成失败或数据无效');
        }
        console.log('生成展开图:', currentGame.net);
        
        // 步骤2：生成选项
        currentGame.options = generateCubeOptions(currentGame.net);
        if (!currentGame.options || currentGame.options.length !== 4) {
            throw new Error('立方体选项生成失败或数量不正确');
        }
        
        // 验证选项质量
        const correctCount = currentGame.options.filter(opt => opt.isCorrect).length;
        if (correctCount !== 1) {
            throw new Error(`正确选项数量错误：应为1个，实际为${correctCount}个`);
        }
        console.log('生成选项:', currentGame.options);
        
        // 步骤3：渲柔到页面
        if (!renderNet(currentGame.net, 'netContainer')) {
            throw new Error('展开图渲染失败');
        }
        
        if (!renderCubeOptions(currentGame.options, 'optionsGrid')) {
            throw new Error('立方体选项渲染失败');
        }
        
        // 步骤4：更新UI状态
        updateQuestionCounter();
        enableUserInteraction();
        
        console.log(`第 ${currentGame.questionNumber - 1} 题生成成功`);
        
    } catch (error) {
        console.error('生成题目时发生错误:', error);
        
        // 根据错误类型显示不同的错误消息
        let userMessage = '生成题目失败';
        if (error.message.includes('展开图')) {
            userMessage = '展开图生成错误，请重试';
        } else if (error.message.includes('选项')) {
            userMessage = '立方体选项生成错误，请重试';
        } else if (error.message.includes('渲染')) {
            userMessage = '页面显示错误，请刷新页面';
        }
        
        showError(`${userMessage}。如问题持续，请刷新页面。`, error);
        
        // 提供重试按钮
        showRetryButton();
    }
}

/**
 * 清除上一题的状态
 */
function clearPreviousState() {
    // 清空反馈区域
    const feedbackSection = document.getElementById('feedbackSection');
    if (feedbackSection) {
        feedbackSection.innerHTML = '';
    }
    
    // 隐藏下一题按钮
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }
    
    // 清除选项状态
    const options = document.querySelectorAll('.cube-option');
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'wrong');
        option.style.pointerEvents = 'auto';
    });
}

/**
 * 启用用户交互
 */
function enableUserInteraction() {
    const options = document.querySelectorAll('.cube-option');
    options.forEach(option => {
        option.style.pointerEvents = 'auto';
    });
}

/**
 * 显示重试按钮
 */
function showRetryButton() {
    const feedbackSection = document.getElementById('feedbackSection');
    if (feedbackSection) {
        const retryButton = document.createElement('button');
        retryButton.textContent = '重新生成题目';
        retryButton.className = 'next-question-btn';
        retryButton.style.marginTop = '16px';
        retryButton.onclick = () => {
            // 重置题目计数器以免跳过
            currentGame.questionNumber--;
            startNewQuestion();
        };
        
        const errorDiv = feedbackSection.querySelector('.feedback.error');
        if (errorDiv) {
            errorDiv.appendChild(retryButton);
        }
    }
}

/**
 * 更新题目计数显示
 */
function updateQuestionCounter() {
    const header = document.querySelector('.game-header p');
    if (header) {
        header.textContent = `根据展开图选择正确的立方体 - 第 ${currentGame.questionNumber} 题`;
    }
    currentGame.questionNumber++;
}

/**
 * 显示错误消息（增强版）
 * @param {string} message - 错误消息
 * @param {Error} [error] - 原始错误对象（可选）
 */
function showError(message, error = null) {
    const feedbackSection = document.getElementById('feedbackSection');
    if (!feedbackSection) {
        console.error('无法显示错误消息：找不到feedbackSection元素');
        return;
    }
    
    // 记录详细错误信息
    if (error) {
        console.error('游戏错误:', message, error);
        console.trace('错误堆栈:');
    } else {
        console.warn('游戏警告:', message);
    }
    
    feedbackSection.innerHTML = `
        <div class="feedback error">
            <div class="feedback-icon">⚠️</div>
            <div class="feedback-text">
                ${message}
                ${error ? '<br><small>请检查控制台获取更多详情</small>' : ''}
            </div>
        </div>
    `;
}

/**
 * 获取游戏统计信息
 * @returns {Object} 游戏统计
 */
function getGameStats() {
    return {
        questionsAnswered: currentGame.questionNumber - 1,
        currentNet: currentGame.net,
        currentOptions: currentGame.options
    };
}

/**
 * 重置游戏
 */
function resetGame() {
    currentGame = {
        net: null,
        options: null,
        questionNumber: 1
    };
    
    // 清空所有显示区域
    const containers = ['netContainer', 'optionsGrid', 'feedbackSection'];
    containers.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
        }
    });
    
    // 重新开始
    startNewQuestion();
}

/**
 * 页面加载完成后初始化游戏
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化游戏...');
    
    // 延迟初始化，确保所有资源加载完成
    setTimeout(() => {
        initGame();
    }, 100);
});

// 将主要函数暴露到全局作用域，便于调试
if (typeof window !== 'undefined') {
    window.gameDebug = {
        getStats: getGameStats,
        resetGame: resetGame,
        startNew: startNewQuestion,
        currentGame: () => currentGame
    };
} 