const formatString = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:ns4="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd">
    {0}
    <cac:AccountingSupplierParty>
    {1}
    </cac:AccountingSupplierParty>
    <cac:AccountingCustomerParty>
    {2}
    </cac:AccountingCustomerParty>
    {3}
    {4}
</Invoice>
<!--XML generat cu aplicatia ANAF ver.1.0.8-->
`

function dateFacturaXml(id_fac, issueDate, dueDate, curr) { return `
<cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:efactura.mfinante.ro:CIUS-RO:1.0.1</cbc:CustomizationID>
<cbc:ID>${id_fac}</cbc:ID>
<cbc:IssueDate>${issueDate}</cbc:IssueDate>
<cbc:DueDate>${dueDate}</cbc:DueDate>
<cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
<cbc:DocumentCurrencyCode>${curr}</cbc:DocumentCurrencyCode>
`
}

    function party(nume_companie, nr_reg, CUI) { return `
    <cac:Party>
    <cac:PostalAddress>
        <cbc:StreetName>Street name</cbc:StreetName>
        <cbc:CityName>SECTOR6</cbc:CityName>
        <cbc:CountrySubentity>RO-B</cbc:CountrySubentity>
        <cac:Country>
            <cbc:IdentificationCode>RO</cbc:IdentificationCode>
        </cac:Country>
    </cac:PostalAddress>
    <cac:PartyTaxScheme>
        <cbc:CompanyID>${CUI}</cbc:CompanyID>
        <cac:TaxScheme/>
    </cac:PartyTaxScheme>
    <cac:PartyLegalEntity>
        <cbc:RegistrationName>${nume_companie}</cbc:RegistrationName>
        <cbc:CompanyID>${CUI}</cbc:CompanyID>
    </cac:PartyLegalEntity>
</cac:Party>
    `
}

function legalTotal(tot_no_vat){ 
    const tot_net = 1.19*tot_no_vat;
    return `
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="RON">0.00</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="RON">${tot_no_vat}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="RON">0.00</cbc:TaxAmount>
            <cac:TaxCategory>
                <cbc:ID>E</cbc:ID>
                <cbc:Percent>0.00</cbc:Percent>
                <cbc:TaxExemptionReasonCode>VATEX-EU-132-1L</cbc:TaxExemptionReasonCode>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="RON">${tot_no_vat}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="RON">${tot_no_vat}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="RON">${tot_no_vat}</cbc:TaxInclusiveAmount>
        <cbc:AllowanceTotalAmount currencyID="RON">0.00</cbc:AllowanceTotalAmount>
        <cbc:ChargeTotalAmount currencyID="RON">0.00</cbc:ChargeTotalAmount>
        <cbc:PrepaidAmount currencyID="RON">0.00</cbc:PrepaidAmount>
        <cbc:PayableRoundingAmount currencyID="RON">0.00</cbc:PayableRoundingAmount>
        <cbc:PayableAmount currencyID="RON">${tot_no_vat}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>

`
}



function item(id, sum, desc, name) { return `
<cac:InvoiceLine>
<cbc:ID>${id}</cbc:ID>
<cbc:InvoicedQuantity unitCode="M4">1.00</cbc:InvoicedQuantity>
<cbc:LineExtensionAmount currencyID="RON">${sum}</cbc:LineExtensionAmount>
<cac:Item>
    <cbc:Name>${name}</cbc:Name>
    <cac:ClassifiedTaxCategory>
        <cbc:ID>E</cbc:ID>
        <cbc:Percent>0.00</cbc:Percent>
        <cac:TaxScheme>
            <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
    </cac:ClassifiedTaxCategory>
</cac:Item>
<cac:Price>
    <cbc:PriceAmount currencyID="RON">${sum}</cbc:PriceAmount>
</cac:Price>
</cac:InvoiceLine>
    `
}

const fac = {
    id_fac: "71",
    issueDate: "2024-04-13",
    dueDate: "2024-04-20",
    curr: "RON",
    seller : {
        nume_companie: "Hello inc",
        nr_reg: "98871798579",
        CUI: "16350738"
    },
    client : {
        nume_companie: "Bye inc",
        nr_reg: "5387685871638",
        CUI: "33184554"
    },
    legal : {
        tot_net: 402,
        tot_no_vat: 300
    },
    items : [
        {
            id: 1, sum: 300, desc: "jfdhskfdhd", name: "fjvkj"
        }
    ]

}

const getXML = (obj_fac) => {
    const d = dateFacturaXml(obj_fac.id_fac,
        obj_fac.issueDate,
        obj_fac.dueDate,
        obj_fac.curr)
    const {client, seller, legal, items} = obj_fac
    const l = legalTotal(legal.tot_no_vat);
    const c = party(client.nume_companie,
        client.nr_reg,
        client.CUI)
    const s = party(seller.nume_companie,
        seller.nr_reg,
        seller.CUI)
    let itemobj = ""
    
    for(let j in items) {
        let i = items[j]
        // append to string

        itemobj += item(i.id, i.sum, i.desc, i.name);
    }
    return formatString
        .replace("{0}", d)
        .replace("{1}", s)
        .replace("{2}", c)
        .replace("{3}", l)
        .replace("{4}", itemobj)
}

module.exports = getXML