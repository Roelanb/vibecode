import React, { useState } from 'react';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

interface TreeViewProps {
  data: TreeNode[];
}

const StyledTreeItemRoot = styled(Box)({
  paddingLeft: '16px',
  marginLeft: '8px',
  borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
});

const StyledTreeItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '4px 0',
});

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const handleNodeToggle = (nodeId: string) => () => {
    setExpandedNodes((prevNodes) =>
      prevNodes.includes(nodeId) ? prevNodes.filter((id) => id !== nodeId) : [...prevNodes, nodeId]
    );
  };

  const renderTree = (nodes: TreeNode[]) => (
    <>
      {nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.includes(node.id);

        return (
          <Box key={node.id}>
            <StyledTreeItem>
              <IconButton onClick={handleNodeToggle(node.id)} size='small'>
                {hasChildren ? (
                  isExpanded ? <ExpandMore /> : <ChevronRight />
                ) : (
                  <Box sx={{ width: 24 }} /> // Placeholder for alignment
                )}
              </IconButton>
              <Typography>{node.name}</Typography>
            </StyledTreeItem>
            <Collapse in={isExpanded} timeout='auto' unmountOnExit>
              {hasChildren && node.children && (
                <StyledTreeItemRoot>{renderTree(node.children)}</StyledTreeItemRoot>
              )}
            </Collapse>
          </Box>
        );
      })}
    </>
  );

  return <>{renderTree(data)}</>;
};

export default TreeView;
