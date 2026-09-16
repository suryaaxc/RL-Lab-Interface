import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AgentState, TreeNode } from '../types';
import { Network } from 'lucide-react';

interface MctsTreeProps {
  agentState: AgentState;
}

const generateInitialTree = (): TreeNode => {
  return {
    id: 'root', name: 'S0', value: 0,
    children: [
      { id: 'c1', name: 'A1', value: 0.5, children: [{ id: 'c1-1', name: 'S1', value: 0.6 }, { id: 'c1-2', name: 'S2', value: 0.2 }] },
      { id: 'c2', name: 'A2', value: 0.8, children: [{ id: 'c2-1', name: 'S3', value: 0.9 }] },
    ]
  };
};

export const MctsTree: React.FC<MctsTreeProps> = ({ agentState }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<TreeNode>(generateInitialTree());
  
  useEffect(() => {
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)) as TreeNode;
      const expandRandomNode = (node: TreeNode, depth: number) => {
        if (depth > 3) return;
        if (!node.children || node.children.length === 0) {
          if (Math.random() > 0.6) {
            node.children = [
              { id: `${node.id}-1`, name: `A${Math.floor(Math.random()*10)}`, value: Math.random() },
              { id: `${node.id}-2`, name: `A${Math.floor(Math.random()*10)}`, value: Math.random() }
            ];
          }
        } else {
          node.children.forEach(c => expandRandomNode(c, depth + 1));
        }
      };
      if (Math.random() > 0.8 && newData.children) {
         newData.children = newData.children.slice(0, Math.max(1, newData.children.length - 1));
      } else {
         expandRandomNode(newData, 0);
      }
      return newData;
    });
  }, [agentState.tick]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 60, bottom: 20, left: 60 };
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.hierarchy<TreeNode>(data);
    const treeLayout = d3.tree<TreeNode>().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    treeLayout(root);

    svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1') // slate-300
      .attr('stroke-width', 1.5)
      .attr('d', d3.linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x(d => d.y)
        .y(d => d.x)
      );

    const node = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle')
      .attr('r', 5)
      .attr('fill', '#ffffff')
      .attr('stroke', d => d.data.value > 0.7 ? '#3b82f6' : '#94a3b8') // blue-500 or slate-400
      .attr('stroke-width', 2);

    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.children ? -8 : 8)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name)
      .attr('fill', '#475569') // slate-600
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('font-family', 'var(--font-mono, monospace)');

  }, [data, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

  return (
    <div className="flex-1 flex flex-col glass-panel p-4 relative overflow-hidden">
       <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">
        <span className="flex items-center gap-2 text-blue-600"><Network size={16} /> MCTS_EXPLORATION_TREE</span>
        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">NODES: {countNodes(data)}</span>
      </div>

      <div className="flex-1 relative bg-slate-50/50 rounded-xl border border-slate-100 mt-2" ref={containerRef}>
        <svg ref={svgRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};

function countNodes(node: TreeNode): number {
  if (!node.children) return 1;
  return 1 + node.children.reduce((acc, c) => acc + countNodes(c), 0);
}
