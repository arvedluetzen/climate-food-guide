---
layout: detail.njk
title: Would You Buy Alternative Proteins?
---

<div id="survey-container"></div>

## Bottom Line

- Most people (79% of households) only buy conventional meat but many (71% of age 18-59) say that they are at least somewhat likely to try in the future. <sup>[[GFI]](https://gfi.org/resource/plant-based-meat-consumer-segmentation/)</sup> 
- The main reasons why people do not eat plant-based meat are taste and price (LINK: article green premium)

# Sources and Further Reading

The questions I used come from different consumer surveys. If you are interested to know more about how people feel towards buying alternative proteins, you can find some reports here:
- Question 1: <a href="https://gfi.org/wp-content/uploads/2024/09/COR24024_Household-shopper-whitepaper.pdf#page=4" target="_blank">What meat things do you purchase?</a>
- Question 2: <a href="https://gfi.org/wp-content/uploads/2025/04/Consumer-snapshot-Plant-based-meat-in-the-US.pdf#page=4.25" target="_blank">How often have you eaten plant-based products in the past 12 months?</a>
- Question 3: <a href="https://gfi.org/wp-content/uploads/2024/09/COR24024_Household-shopper-whitepaper.pdf#page=16" target="_blank">Why have you not eaten plant-based meat recently?</a>
- Question 4: <a href="https://gfi.org/wp-content/uploads/2025/04/Consumer-snapshot-Plant-based-meat-in-the-US.pdf#page=11.1 " target="_blank">Imagine you see a new plant-based meat product the ext time you are grocery shopping. Which of the following reasons, if any, would convince you to buy it?</a>

This is a summary of general consumer insights regarding alternative proteins:
<a href="https://gfi.org/industry/consumer-insights/" target="_blank">Consumer insights</a>

If you are in for a deep dive into sales and customer data for plant based seafood then this is for you:
<a href="https://gfi.org/resource/analyzing-plant-based-meat-and-seafood-sales/" target="_blank">Analyzing plant-based meat & seafood sales</a>

This article gives a great overview of why people eat what they eat:
<a href="https://apnorc.org/projects/taste-cost-and-health-concerns-far-outweigh-environmental-considerations-when-people-choose-what-to-eat/" target="_blank">Taste, cost, and health concerns far outweigh environmental considerations when people choose what to eat</a>




<script>
(function() {
  // Survey Configuration - Fill in your survey data here
  const surveyConfig = {
    questions: [
      {
        id: 'meat-purchase',
        title: 'What meat things do you purchase?',
        type: 'exclusive',
        options: [
          { label: 'Only conventional meat', percentage: 79 },
          { label: 'Both conventional and plant-based meat', percentage: 21 },
          { label: 'Only plant-based meat', percentage: 0.5 }
        ],
        explanation: ''
      },
      {
        id: 'frequency',
        title: 'How often have you eaten plant-based products in the past 12 months?',
        subtitle: 'For whichever of: plant-based meat, plant-based poultry, or plant-based seafood you ate most frequently',
        type: 'exclusive',
        options: [
          { label: 'Weekly+', percentage: 11 },
          { label: 'Every 2-3 weeks', percentage: 8 },
          { label: 'Once a month', percentage: 6 },
          { label: 'Every 2-3 months', percentage: 5 },
          { label: 'Once every 4-6 months', percentage: 5 },
          { label: 'Once in the past 12 months', percentage: 5 },
          { label: 'Have eaten, not in the past year', percentage: 13 },
          { label: 'Never', percentage: 43 },
          { label: 'I don\'t know', percentage: 4 }
        ],
        explanation: ''
      },
      {
        id: 'not-eaten',
        title: 'Why have you not eaten plant-based meat recently?',
        subtitle: 'Originally this question was for people who tried plant-based meat only once. There are also numbers for <a href="https://gfi.org/wp-content/uploads/2024/09/COR24024_Household-shopper-whitepaper.pdf#page=12" target="_blank">those who consume it regularly</a> and <a href="https://gfi.org/wp-content/uploads/2024/09/COR24024_Household-shopper-whitepaper.pdf#page=16.25" target="_blank">those who have never tried</a>',
        type: 'select-multiple',
        selectCount: 5,
        options: [
          { label: 'I prefer animal meat', percentage: 33 },
          { label: 'It\'s to expensive', percentage: 29 },
          { label: 'I never think about it', percentage: 23 },
          { label: 'I didn\'t like the texture', percentage: 21 },
          { label: 'I didn\'t like the taste', percentage: 18 },
          { label: 'It\'s to processed', percentage: 17 },
          { label: 'I don\'t see a reason to eat plant-based meat', percentage: 15 },
          { label: 'My family or others in my household don\'t like it', percentage: 13 },
          { label: 'It has ingredients I don\'t recognize', percentage: 10 },
          { label: 'It has too many ingredients', percentage: 9 },
          { label: 'It isn\'t easy to find in grocery stores or restaurants', percentage: 8 },
          { label: 'It\'s too high in sodium', percentage: 7 },
          { label: 'I plan to try it again, but haven\'t had the chance yet', percentage: 7 },
          { label: 'It\'s not healthy', percentage: 5 },
          { label: 'I\'m not sure how to cook it', percentage: 3 },
          { label: 'It doesn\'t have as much protein as conventional meat', percentage: 3 },
          { label: 'I don\'t know', percentage: 7 },
        ],
        explanation: 'Price and taste remain the primary barriers, but health concerns are growing. Multiple factors influence purchase decisions.'
      },
      {
        id: 'would-convince',
        title: 'Imagine you see a new plant-based meat product the ext time you are grocery shopping. Which of the following reasons, if any, would convince you to buy it?',
        subtitle: 'Select all that apply',
        type: 'select-multiple',
        selectCount: 7,
        options: [
          { label: 'The taste and texture is exactly like conventional meat when trying a sample in-store', percentage: [38,36,22] },
          { label: 'It costs less than conventional meat', percentage: [31, 35, 20] },
          { label: 'The label shows it has more protein than conventional meat', percentage: [35, 24, 13] },
          { label: 'THe label shows it has less fat or less cholesterol than conventional meat', percentage: [35, 21, 12] },
          { label: 'The label shows it makes less of an environmental impact then conventional meat', percentage: [32, 15, 8] },
          { label: 'It costs the same as conventional meat', percentage: [25, 16, 11] },
          { label: 'Nothing would convince me.', percentage: [6, 29, 54] }
        ],
        explanation: 'Price and taste improvements top the list, but environmental and health considerations are also significant motivators.'
      }
    ]
  };

  // Initialize survey on page load
  function initSurvey() {
    const container = document.getElementById('survey-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    surveyConfig.questions.forEach((question, index) => {
      const questionElement = createQuestionElement(question, index);
      container.appendChild(questionElement);
    });
  }

  function createQuestionElement(question, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'survey-question-wrapper';
    wrapper.id = `question-${index}`;
    
    const titleElement = document.createElement('div');
    titleElement.className = 'survey-question-title';
    titleElement.innerHTML = `<h2>${question.title}</h2>`;
    if (question.subtitle) {
      titleElement.innerHTML += `<p class="survey-subtitle">${question.subtitle}</p>`;
    }
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'survey-options-container';
    
    const isMultiSelect = question.type === 'select-multiple';
    const selectedIndices = new Set();
    
    question.options.forEach((option, optIndex) => {
      const optionElement = document.createElement('button');
      optionElement.className = 'survey-option';
      optionElement.setAttribute('data-index', optIndex);
      
      if (isMultiSelect) {
        optionElement.innerHTML = `
          <span class="survey-checkbox"></span>
          <span class="survey-option-label">${option.label}</span>
        `;
        
        optionElement.addEventListener('click', () => {
          if (selectedIndices.has(optIndex)) {
            selectedIndices.delete(optIndex);
            optionElement.classList.remove('selected');
          } else {
            selectedIndices.add(optIndex);
            optionElement.classList.add('selected');
          }
        });
      } else {
        optionElement.innerHTML = `
          <span class="survey-option-label">${option.label}</span>
        `;
        
        optionElement.addEventListener('click', () => {
          showChart(question, [optIndex], wrapper);
        });
      }
      
      optionsContainer.appendChild(optionElement);
    });
    
    // Add submit button for multi-select questions
    if (isMultiSelect) {
      const submitButton = document.createElement('button');
      submitButton.className = 'survey-submit-button';
      submitButton.textContent = 'Show Results';
      submitButton.addEventListener('click', () => {
        if (selectedIndices.size > 0) {
          showChart(question, Array.from(selectedIndices), wrapper);
        }
      });
      optionsContainer.appendChild(submitButton);
    }
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'survey-chart-container';
    chartContainer.style.display = 'none';
    
    const explanationContainer = document.createElement('div');
    explanationContainer.className = 'survey-explanation';
    explanationContainer.innerHTML = question.explanation;
    explanationContainer.style.display = 'none';
    
    wrapper.appendChild(titleElement);
    wrapper.appendChild(optionsContainer);
    wrapper.appendChild(chartContainer);
    wrapper.appendChild(explanationContainer);
    
    return wrapper;
  }

  function showChart(question, selectedIndices, questionElement) {
    const optionsContainer = questionElement.querySelector('.survey-options-container');
    const chartContainer = questionElement.querySelector('.survey-chart-container');
    const explanationContainer = questionElement.querySelector('.survey-explanation');
    
    // Hide options, show chart and explanation
    optionsContainer.style.display = 'none';
    
    // Ensure selectedIndices is an array and create a Set for easy lookup
    const selectedSet = new Set(Array.isArray(selectedIndices) ? selectedIndices : [selectedIndices]);
    
    // Check if this is a multi-group question (percentages are arrays)
    const isMultiGroup = Array.isArray(question.options[0].percentage);
    
    // Create horizontal bar chart
    const barHeight = isMultiGroup ? 30 : 50;
    const barSpacing = isMultiGroup ? 120 : 85;
    const chartHeight = question.options.length * barSpacing;
    const svgHeight = chartHeight + (isMultiGroup ? 100 : 60);
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 1400 ${svgHeight}`);
    svg.setAttribute('class', 'survey-chart');
    
    const margin = { left: 470, right: 60, top: isMultiGroup ? 60 : 30, bottom: 30 };
    const chartWidth = 1400 - margin.left - margin.right;
    
    const maxPercentage = isMultiGroup 
      ? Math.max(...question.options.flatMap(o => o.percentage))
      : Math.max(...question.options.map(o => o.percentage));
    
    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '1400');
    bg.setAttribute('height', svgHeight);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);
    
    // X-axis line (vertical left)
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top);
    xAxis.setAttribute('x2', margin.left);
    xAxis.setAttribute('y2', margin.top + question.options.length * barSpacing);
    xAxis.setAttribute('stroke', '#999');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);
    
    // Y-axis line (horizontal bottom)
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top + question.options.length * barSpacing);
    yAxis.setAttribute('x2', margin.left + chartWidth);
    yAxis.setAttribute('y2', margin.top + question.options.length * barSpacing);
    yAxis.setAttribute('stroke', '#999');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);
    
    // X-axis labels and grid (percentage scale)
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxPercentage / 5) * i);
      const x = margin.left + (chartWidth / 5) * i;
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x);
      label.setAttribute('y', margin.top + question.options.length * barSpacing + 25);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '12');
      label.setAttribute('fill', '#666');
      label.textContent = value + '%';
      svg.appendChild(label);
      
      // Grid line
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', x);
      gridLine.setAttribute('y1', margin.top);
      gridLine.setAttribute('x2', x);
      gridLine.setAttribute('y2', margin.top + question.options.length * barSpacing);
      gridLine.setAttribute('stroke', '#e0e0e0');
      gridLine.setAttribute('stroke-width', '1');
      svg.appendChild(gridLine);
    }
    
    // Legend for multi-group charts
    if (isMultiGroup) {
      const groupNames = ['Monthly+', 'Lapsers', 'Holdouts'];
      const groupColors = ['#ef6b4a', '#f0a58e', '#f5d4c8'];
      
      groupNames.forEach((name, idx) => {
        const legendX = margin.left + idx * 180;
        const legendY = 20;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', legendX);
        rect.setAttribute('y', legendY);
        rect.setAttribute('width', '30');
        rect.setAttribute('height', '15');
        rect.setAttribute('fill', groupColors[idx]);
        rect.setAttribute('rx', '3');
        svg.appendChild(rect);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', legendX + 40);
        text.setAttribute('y', legendY + 12);
        text.setAttribute('font-size', '14');
        text.setAttribute('fill', '#333');
        text.textContent = name;
        svg.appendChild(text);
      });
    }
    
    // Bars
    question.options.forEach((option, index) => {
      const isSelected = selectedSet.has(index);
      
      if (isMultiGroup) {
        // Multi-group bars
        const groupColors = ['#ef6b4a', '#f0a58e', '#f5d4c8'];
        const groupNames = ['Monthly+', 'Lapsers', 'Holdouts'];
        const subBarHeight = 25;
        const subBarGap = 5;
        
        option.percentage.forEach((pct, groupIdx) => {
          const barWidth = (pct / maxPercentage) * chartWidth;
          const y = margin.top + (index * barSpacing) + (groupIdx * (subBarHeight + subBarGap));
          
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', margin.left);
          rect.setAttribute('y', y);
          rect.setAttribute('width', barWidth);
          rect.setAttribute('height', subBarHeight);
          rect.setAttribute('fill', isSelected ? groupColors[groupIdx] : '#d0d0d0');
          rect.setAttribute('rx', '4');
          svg.appendChild(rect);
          
          // Group name label on the bar
          const groupLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          groupLabel.setAttribute('x', margin.left + 10);
          groupLabel.setAttribute('y', y + subBarHeight / 2 + 5);
          groupLabel.setAttribute('font-size', '13');
          groupLabel.setAttribute('font-weight', '600');
          groupLabel.setAttribute('fill', isSelected ? 'white' : '#666');
          groupLabel.textContent = groupNames[groupIdx];
          svg.appendChild(groupLabel);
          
          // Value label - always to the right for multi-group
          const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          valueLabel.setAttribute('x', margin.left + barWidth + 10);
          valueLabel.setAttribute('y', y + subBarHeight / 2 + 5);
          valueLabel.setAttribute('font-size', '16');
          valueLabel.setAttribute('font-weight', 'bold');
          valueLabel.setAttribute('fill', '#333');
          valueLabel.textContent = pct + '%';
          svg.appendChild(valueLabel);
        });
        
        // Y-axis label - wrap long text
        const words = option.label.split(' ');
        const maxCharsPerLine = 35;
        const lines = [];
        let currentLine = [];
        
        words.forEach(word => {
          const testLine = currentLine.concat(word).join(' ');
          if (testLine.length > maxCharsPerLine && currentLine.length > 0) {
            lines.push(currentLine.join(' '));
            currentLine = [word];
          } else {
            currentLine.push(word);
          }
        });
        if (currentLine.length > 0) lines.push(currentLine.join(' '));
        
        const baseY = margin.top + (index * barSpacing) + 40;
        lines.forEach((line, lineIdx) => {
          const axisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          axisLabel.setAttribute('x', margin.left - 15);
          axisLabel.setAttribute('y', baseY + (lineIdx * 28));
          axisLabel.setAttribute('text-anchor', 'end');
          axisLabel.setAttribute('font-size', '24');
          axisLabel.setAttribute('font-weight', '500');
          axisLabel.setAttribute('fill', '#333');
          axisLabel.textContent = line;
          svg.appendChild(axisLabel);
        });
        
      } else {
        // Single bar
        const barWidth = (option.percentage / maxPercentage) * chartWidth;
        const y = margin.top + (index * barSpacing) + 10;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', margin.left);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', isSelected ? '#ef6b4a' : '#d0d0d0');
        rect.setAttribute('rx', '4');
        svg.appendChild(rect);
        
        // Value label - inside for large values, outside for small
        const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const putLabelOutside = option.percentage < 8;
        
        if (putLabelOutside) {
          valueLabel.setAttribute('x', margin.left + barWidth + 10);
          valueLabel.setAttribute('text-anchor', 'start');
        } else {
          valueLabel.setAttribute('x', margin.left + barWidth - 15);
          valueLabel.setAttribute('text-anchor', 'end');
        }
        
        valueLabel.setAttribute('y', y + barHeight / 1.5);
        valueLabel.setAttribute('font-size', '30');
        valueLabel.setAttribute('font-weight', 'bold');
        valueLabel.setAttribute('fill', '#333');
        valueLabel.textContent = option.percentage + '%';
        svg.appendChild(valueLabel);
        
        // Y-axis label - wrap long text
        const words = option.label.split(' ');
        const maxCharsPerLine = 30;
        const lines = [];
        let currentLine = [];
        
        words.forEach(word => {
          const testLine = currentLine.concat(word).join(' ');
          if (testLine.length > maxCharsPerLine && currentLine.length > 0) {
            lines.push(currentLine.join(' '));
            currentLine = [word];
          } else {
            currentLine.push(word);
          }
        });
        if (currentLine.length > 0) lines.push(currentLine.join(' '));
        
        const baseY = y + barHeight / 2 + 8;
        const lineHeight = 32;
        const startY = baseY - ((lines.length - 1) * lineHeight / 2);
        
        lines.forEach((line, lineIdx) => {
          const axisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          axisLabel.setAttribute('x', margin.left - 15);
          axisLabel.setAttribute('y', startY + (lineIdx * lineHeight));
          axisLabel.setAttribute('text-anchor', 'end');
          axisLabel.setAttribute('font-size', '30');
          axisLabel.setAttribute('font-weight', '500');
          axisLabel.setAttribute('fill', '#333');
          axisLabel.textContent = line;
          svg.appendChild(axisLabel);
        });
      }
    });
    
    chartContainer.innerHTML = '';
    chartContainer.appendChild(svg);
    chartContainer.style.display = 'block';
    explanationContainer.style.display = 'block';
    
    // Scroll to chart
    chartContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Run when the page loads or when content is inserted
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSurvey);
  } else {
    initSurvey();
  }
})();
</script>

<style>
  #survey-container {
    max-width: 100%;
  }

  .survey-question-wrapper {
    margin-bottom: 4rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .survey-question-wrapper:last-child {
    border-bottom: none;
  }

  .survey-question-title h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .survey-subtitle {
    font-size: 0.95rem;
    color: #666;
    font-style: italic;
    margin-top: 0.25rem;
  }

  .survey-options-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin: 1.5rem 0;
    transition: all 0.3s ease;
  }

  .survey-option {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: #fafafa;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    text-align: left;
  }

  .survey-option:hover {
    background: #f0f0f0;
    border-color: #ef6b4a;
    transform: translateX(4px);
  }

  .survey-option.selected {
    background: #fef3f0;
    border-color: #ef6b4a;
  }

  .survey-option-label {
    font-weight: 500;
    color: #333;
    flex: 1;
  }

  .survey-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #999;
    border-radius: 4px;
    flex-shrink: 0;
    position: relative;
    transition: all 0.2s ease;
  }

  .survey-option.selected .survey-checkbox {
    background: #ef6b4a;
    border-color: #ef6b4a;
  }

  .survey-option.selected .survey-checkbox::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
  }

  .survey-submit-button {
    margin-top: 1.5rem;
    padding: 1rem 2rem;
    background: #ef6b4a;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
  }

  .survey-submit-button:hover {
    background: #d85a3a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 107, 74, 0.3);
  }

  .survey-chart-container {
    margin: 2rem 0;
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 1.5rem 0;
  }

  .survey-chart {
    width: 100%;
    height: auto;
  }

  .survey-explanation {
    margin-top: 1.5rem;
    padding: 1.25rem;
    background: #f5f5f5;
    border-left: 4px solid #ef6b4a;
    border-radius: 4px;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #555;
  }

  @media (max-width: 640px) {
    .survey-option {
      padding: 0.85rem 1rem;
      font-size: 0.9rem;
    }

    .survey-question-title h2 {
      font-size: 1.25rem;
    }

    .survey-chart-container {
      padding: 1rem 0;
      overflow-x: auto;
    }
  }
</style>
