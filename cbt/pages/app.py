import streamlit as st
import pdfplumber
import docx
import re

# --- Helper Functions ---

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file):
    doc = docx.Document(file)
    text = []
    for para in doc.paragraphs:
        text.append(para.text)
    return "\n".join(text)

def find_reference_section(text):
    """
    Attempts to split the text into 'Body' and 'Bibliography' 
    based on common headers.
    """
    # Common headers for reference sections
    headers = [
        r"\nReferences\s*\n", 
        r"\nBibliography\s*\n", 
        r"\nWorks Cited\s*\n", 
        r"\nREFERENCES\s*\n"
    ]
    
    split_index = -1
    found_header = ""

    for header in headers:
        match = re.search(header, text)
        if match:
            split_index = match.start()
            found_header = header
            break
    
    if split_index != -1:
        body = text[:split_index]
        # items after the header
        references_text = text[split_index + len(found_header):] 
        return body, references_text
    else:
        return text, "" # Could not find reference section

def extract_citations(text):
    """
    Finds in-text citations. 
    Targeting pattern: (Name, Year) or (Name & Name, Year) or (Name et al., Year)
    """
    # Regex for APA/Harvard style: (Smith, 2019) or (Smith & Jones, 2020)
    # This is a basic regex and may need tuning for specific needs
    pattern = r"\(([A-Za-z\s&.]+),\s+(\d{4})\)"
    matches = re.findall(pattern, text)
    
    # Normalize matches to a list of strings "Name, Year"
    citations = [f"{m[0]}, {m[1]}" for m in matches]
    return set(citations)

def parse_reference_list(ref_text):
    """
    Attempts to parse the bibliography text into individual entries.
    This looks for lines that start with a Name and a Year.
    """
    # Split by new lines, but simple splitting might break multi-line references.
    # For this prototype, we check if a line contains a year in parentheses early on.
    
    found_refs = set()
    lines = ref_text.split('\n')
    
    for line in lines:
        line = line.strip()
        if len(line) < 10: continue
        
        # Look for the year pattern (20xx) usually found near the start of a reference entry
        # e.g., Smith, J. (2020). Title...
        year_match = re.search(r"\((\d{4})\)", line)
        
        if year_match:
            # Extract the year
            year = year_match.group(1)
            # Extract the generic last name from the start of the line
            # Assuming format: LastName, F. M. (Year)
            name_match = re.match(r"^([A-Za-z]+)", line)
            if name_match:
                name = name_match.group(1)
                found_refs.add(f"{name}, {year}")
                
    return found_refs

# --- Main Webpage Logic ---

st.set_page_config(page_title="Citation Scanner", layout="wide")

st.title("📄 Project Reference Scanner")
st.markdown("""
This tool scans your thesis or project document to find:
1. **In-Text Citations:** References mentioned inside paragraphs.
2. **Bibliography Entries:** References listed at the end.
3. **Discrepancies:** Which ones are missing from either side?
""")

st.info("Note: This tool is optimized for APA/Harvard style formatting: `(Author, Year)`.")

uploaded_file = st.file_uploader("Upload your Project (PDF or Docx)", type=['pdf', 'docx'])

if uploaded_file is not None:
    with st.spinner('Scanning document...'):
        # 1. Extract Text
        if uploaded_file.name.endswith('.pdf'):
            full_text = extract_text_from_pdf(uploaded_file)
        elif uploaded_file.name.endswith('.docx'):
            full_text = extract_text_from_docx(uploaded_file)
        else:
            st.error("Unsupported file format")
            full_text = ""

    if full_text:
        # 2. Split Body and References
        body_text, ref_section_text = find_reference_section(full_text)

        if not ref_section_text:
            st.warning("Could not automatically find a 'References' or 'Bibliography' section header. The analysis might be inaccurate.")
            ref_section_text = "" # Proceeding assuming everything is body text

        # 3. Analyze
        in_text_citations = extract_citations(body_text)
        listed_references = parse_reference_list(ref_section_text)

        # 4. Compare
        # Listed in Bib, but NOT in text
        unused_references = listed_references - in_text_citations
        # Cited in text, but NOT in Bib (approximate matching)
        missing_from_bib = in_text_citations - listed_references

        # 5. Display Results
        col1, col2 = st.columns(2)

        with col1:
            st.subheader(f"🔍 Found in Text ({len(in_text_citations)})")
            st.write(in_text_citations)
        
        with col2:
            st.subheader(f"📚 Found in Bibliography ({len(listed_references)})")
            st.write(listed_references)

        st.divider()
        
        st.subheader("⚠️ Analysis Results")
        
        c1, c2 = st.columns(2)
        
        with c1:
            st.error(f"Cited in text, but MISSING from Bibliography ({len(missing_from_bib)})")
            if missing_from_bib:
                for item in missing_from_bib:
                    st.write(f"- {item}")
            else:
                st.success("All in-text citations appear in the bibliography!")

        with c2:
            st.warning(f"In Bibliography, but NOT cited in text ({len(unused_references)})")
            if unused_references:
                for item in unused_references:
                    st.write(f"- {item}")
            else:
                st.success("All bibliography entries are used in the text!")