import { Edge, Node } from 'reactflow';
import { WBSNode, WBSNodeData, PLMXMLItem, WBSType } from '../types';

/**
 * Calculates WBS codes (e.g., 1, 1.1, 1.1.1) based on the graph structure.
 * This assumes a top-down hierarchy where Y position roughly dictates level,
 * but primarily relies on Edge connections.
 */
export const calculateWBSCodes = (nodes: WBSNode[], edges: Edge[]): WBSNode[] => {
  // 1. Build an adjacency list (parent -> children)
  const adjacency: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  nodes.forEach(node => {
    adjacency[node.id] = [];
    inDegree[node.id] = 0;
  });

  edges.forEach(edge => {
    if (adjacency[edge.source]) {
      adjacency[edge.source].push(edge.target);
      inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
    }
  });

  // 2. Find root nodes (inDegree === 0)
  // Sort roots by X position to have left-to-right numbering
  const roots = nodes
    .filter(n => inDegree[n.id] === 0)
    .sort((a, b) => a.position.x - b.position.x);

  const updatedNodesMap = new Map<string, WBSNode>();
  nodes.forEach(n => updatedNodesMap.set(n.id, { ...n, data: { ...n.data, wbsCode: '' } }));

  // 3. BFS/DFS Traversal to assign codes
  const traverse = (nodeId: string, code: string) => {
    const node = updatedNodesMap.get(nodeId);
    if (node) {
      node.data.wbsCode = code;
    }

    const childrenIds = adjacency[nodeId] || [];
    // Sort children by X position to ensure visual left-to-right ordering matches code ordering
    const childrenNodes = childrenIds
      .map(id => updatedNodesMap.get(id))
      .filter((n): n is WBSNode => !!n)
      .sort((a, b) => a.position.x - b.position.x);

    childrenNodes.forEach((child, index) => {
      traverse(child.id, `${code}.${index + 1}`);
    });
  };

  roots.forEach((root, index) => {
    traverse(root.id, `${index + 1}`);
  });

  return Array.from(updatedNodesMap.values());
};

/**
 * Generates a JSON string of the current WBS structure.
 */
export const exportToJSON = (nodes: WBSNode[], edges: Edge[]) => {
  const data = {
    meta: {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      generator: 'WBS Architect',
    },
    nodes,
    edges,
  };
  return JSON.stringify(data, null, 2);
};

/**
 * Helper to build a tree structure for XML export
 */
const buildTree = (nodes: WBSNode[], edges: Edge[]): PLMXMLItem[] => {
  const nodeMap = new Map<string, PLMXMLItem>();
  const nodesData = calculateWBSCodes(nodes, edges); // Ensure fresh codes

  nodesData.forEach(n => {
    nodeMap.set(n.id, {
      id: n.id,
      name: n.data.label,
      wbsCode: n.data.wbsCode || '',
      type: n.data.type,
      children: [],
    });
  });

  const roots: PLMXMLItem[] = [];
  const processedChildren = new Set<string>();

  edges.forEach(edge => {
    const parent = nodeMap.get(edge.source);
    const child = nodeMap.get(edge.target);
    if (parent && child) {
      parent.children.push(child);
      processedChildren.add(child.id);
    }
  });

  nodeMap.forEach((item, id) => {
    if (!processedChildren.has(id)) {
      roots.push(item);
    }
  });
  
  // Sort roots and children by WBS Code logic (simple sort based on generated code)
  const sortFn = (a: PLMXMLItem, b: PLMXMLItem) => a.wbsCode.localeCompare(b.wbsCode, undefined, { numeric: true });
  
  const sortRecursive = (items: PLMXMLItem[]) => {
    items.sort(sortFn);
    items.forEach(i => sortRecursive(i.children));
  };

  sortRecursive(roots);
  return roots;
};

/**
 * Generates a basic PLMXML-compatible XML string.
 * Note: Real PLMXML is complex; this is a simplified structural representation 
 * compliant with the prompt's request for XML export.
 */
export const exportToPLMXML = (nodes: WBSNode[], edges: Edge[]) => {
  const tree = buildTree(nodes, edges);

  const generateXMLRecursive = (items: PLMXMLItem[], indent: number = 4): string => {
    const spaces = ' '.repeat(indent);
    return items.map(item => `
${spaces}<WBSElement id="${item.id}" type="${item.type}" wbsCode="${item.wbsCode}">
${spaces}  <Name>${item.name}</Name>
${spaces}  <UserData>
${spaces}     <UserValue title="wbs_code" value="${item.wbsCode}"/>
${spaces}  </UserData>${item.children.length > 0 ? `
${spaces}  <Children>${generateXMLRecursive(item.children, indent + 4)}
${spaces}  </Children>` : ''}
${spaces}</WBSElement>`).join('');
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<PLMXML xmlns="http://www.plmxml.org/Schemas/PLMXMLSchema" date="${new Date().toISOString()}">
  <Header>
    <Generator>WBS Architect</Generator>
  </Header>
  <Structure>
    ${generateXMLRecursive(tree)}
  </Structure>
</PLMXML>`;
};
