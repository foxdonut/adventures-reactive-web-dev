<?xml version="1.0" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" 
    xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg">
<xsl:output method="xml" indent="yes"
    doctype-public="-//W3C//DTD SVG 1.0//EN"
    doctype-system="http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"/>

<xsl:template match="@*|node()">
  <xsl:copy>
    <xsl:apply-templates select="@*|node()"/>
  </xsl:copy> 
</xsl:template>

<xsl:template match="svg:svg">
  <svg xmlns="http://www.w3.org/2000/svg">
    <!-- Order is important here, so the attributes below overrides the 
         originals, which are copied "wholesale" -->
    <xsl:apply-templates select="@*" />
 
    <defs>
      <linearGradient id="shadowh">
         <stop offset="90%" stop-color="black"/>
         <stop offset="100%" stop-color="white"/>
      </linearGradient>

      <linearGradient id="shadowv" x2="0%" y2="100%">
         <stop offset="90%" stop-color="#888"/>
         <stop offset="100%" stop-color="white"/>
      </linearGradient>

      <linearGradient id="shadowb" x2="100%" y2="100%">
         <stop offset="90%" stop-color="#CCC"/>
         <stop offset="100%" stop-color="white"/>
      </linearGradient>

      <linearGradient id="lightgrey" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" style="stop-color:rgb(255,255,255)"/>
         <stop offset="100%" style="stop-color:rgb(128,128,128)"/>
      </linearGradient>

      <linearGradient id="lightblue" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" style="stop-color:rgb(255,255,255)"/>
         <stop offset="100%" style="stop-color:rgb(128,128,255)"/>
      </linearGradient>

      <linearGradient id="lightcoral" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" style="stop-color:rgb(255,255,255)"/>
         <stop offset="100%" style="stop-color:rgb(255,128,128)"/>
      </linearGradient>

      <linearGradient id="lightgreen" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" style="stop-color:rgb(255,255,255)"/>
         <stop offset="100%" style="stop-color:rgb(128,255,128)"/>
      </linearGradient>

      <linearGradient id="lightyellow" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" style="stop-color:rgb(255,255,255)"/>
         <stop offset="100%" style="stop-color:rgb(255,255,128)"/>
      </linearGradient>

      <linearGradient id="none" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" style="stop-color:rgb(255,255,255)"/>
         <stop offset="100%" style="stop-color:rgb(255,255,255)"/>
      </linearGradient>
    </defs>

    <xsl:apply-templates />
  </svg>
</xsl:template>

<!-- Match the top most "g" as Graphviz does stupid stuff to it. -->
<xsl:template match="/svg:svg/svg:g"> 
  <g>
    <xsl:apply-templates select="@*"/>
    <!-- Graphviz uses a polygon as the background. Don't want a gradient there -->
    <xsl:for-each select="svg:polygon">
      <xsl:copy><xsl:apply-templates select="@*" /></xsl:copy>
    </xsl:for-each>
    <xsl:apply-templates select="svg:title|svg:g" />
  </g>
</xsl:template> 
 

<!--
<xsl:template match="svg:text">
   <text style="font-size:12pt; font-family:Arial">
     <xsl:apply-templates select="@*|text()" />
   </text>
</xsl:template> 
-->


<!-- This is longer, but it can be expanded to cover more 
     tags simply by changing the "match" attribute -->
     <!-- match polygon with class="node" only -->
<xsl:template match="svg:g[@class='node']/svg:polygon|svg:ellipse">
        <xsl:element name="{name()}">
          <xsl:apply-templates select="@*"/>
          <xsl:attribute name="style">fill:url(#shadowb); stroke: none</xsl:attribute> 
          <xsl:attribute name="transform">translate(5,5)</xsl:attribute>
        </xsl:element>
        <xsl:element name="{name()}">
          <xsl:apply-templates select="@*"/>
          <xsl:attribute name="style">fill:url(#shadowh); stroke: none</xsl:attribute> 
          <xsl:attribute name="transform">translate(5,0)</xsl:attribute>
        </xsl:element>
        <xsl:element name="{name()}">
          <xsl:apply-templates select="@*"/>
          <xsl:attribute name="style">fill:url(#shadowv); stroke: none</xsl:attribute> 
          <xsl:attribute name="transform">translate(0,5)</xsl:attribute>
        </xsl:element>
        <xsl:element name="{name()}">
          <xsl:apply-templates select="@*"/>
          <xsl:attribute name="style">fill: black; stroke: none; fill-opacity:0.3</xsl:attribute> 
          <xsl:attribute name="transform">translate(-3,3)</xsl:attribute>
        </xsl:element>
        <xsl:element name="{name()}">
          <xsl:apply-templates select="@*" />
          <xsl:attribute name="style">fill:url(#<xsl:value-of select="normalize-space(substring-after(substring-before(@style,';'),'fill:'))"/>);stroke:black;</xsl:attribute>
        </xsl:element>
</xsl:template>

</xsl:stylesheet>
